import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { DataTable, DataTableHead, DataTableRow, DataTableCell } from "@/components/DataTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, BanknoteIcon, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { withAuth } from "@/components/auth/with-auth";
import { AdminLayout } from "@/components/layouts/admin-layout";

type PaymentStatus = 'pending' | 'completed' | 'failed';

type Payment = {
  id: string;
  booking_id: string;
  amount: number;
  status: PaymentStatus;
  payment_method: string;
  transaction_id: string | null;
  created_at: string;
  updated_at: string;
  bookings?: {
    contact_phone: string;
    profiles?: {
      username: string | null;
    };
  };
};

type PaymentStats = {
  total_revenue: number;
  pending_amount: number;
  completed_amount: number;
  failed_amount: number;
  cash_payments_count: number;
  card_payments_count: number;
  transfer_payments_count: number;
};

const isValidPaymentStatus = (status: string): status is PaymentStatus => {
  return ['pending', 'completed', 'failed'].includes(status);
};

const PaymentsManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
    fetchStats();
    const subscription = setupRealtimeSubscription();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            contact_phone,
            profiles:user_id (
              username
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validatedPayments = (data || []).map(payment => {
        if (!isValidPaymentStatus(payment.status)) {
          console.error(`Invalid payment status: ${payment.status}`);
          return {
            ...payment,
            status: 'pending' as PaymentStatus
          };
        }
        return payment as Payment;
      });

      setPayments(validatedPayments);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_payment_stats');
      if (error) throw error;
      setStats(data[0]);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    return supabase
      .channel('payments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
        },
        () => {
          fetchPayments();
          fetchStats();
        }
      )
      .subscribe();
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('fr-DZ')} DZD`;
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-bold mb-6">Gestion des Paiements</h1>

        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                <CreditCard className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Attente</CardTitle>
                <ArrowUpDown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.pending_amount)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements en Espèces</CardTitle>
                <BanknoteIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cash_payments_count}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paiements par Carte</CardTitle>
                <Wallet className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.card_payments_count}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <DataTable>
          <thead>
            <DataTableRow>
              <DataTableHead>Client</DataTableHead>
              <DataTableHead>Montant</DataTableHead>
              <DataTableHead>Méthode</DataTableHead>
              <DataTableHead>Statut</DataTableHead>
              <DataTableHead>ID Transaction</DataTableHead>
              <DataTableHead>Date</DataTableHead>
            </DataTableRow>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <DataTableRow key={payment.id}>
                <DataTableCell>
                  <div>
                    <div>{payment.bookings?.profiles?.username || 'Utilisateur inconnu'}</div>
                    <div className="text-sm text-gray-500">{payment.bookings?.contact_phone}</div>
                  </div>
                </DataTableCell>
                <DataTableCell>{formatCurrency(payment.amount)}</DataTableCell>
                <DataTableCell className="capitalize">{payment.payment_method}</DataTableCell>
                <DataTableCell>
                  <span className={`capitalize font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </DataTableCell>
                <DataTableCell>{payment.transaction_id || '-'}</DataTableCell>
                <DataTableCell>
                  {new Date(payment.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </DataTableCell>
              </DataTableRow>
            ))}
          </tbody>
        </DataTable>
      </div>
    </AdminLayout>
  );
};

export default withAuth(PaymentsManagement, true);
