
import { Hero } from "@/components/Hero";
import { SearchForm } from "@/components/SearchForm";

const Index = () => {
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-sage-50 to-white">
      <Hero />
      <SearchForm />
    </div>
  );
};

export default Index;
