import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductSections from '@/components/home/ProductSections';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-200">
      <Hero />
      <CategoryGrid />
      <ProductSections />
    </div>
  );
};

export default HomePage;
