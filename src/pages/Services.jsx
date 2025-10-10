import { services, serviceCategories } from "../data/services";
import Accordion from "./services/Accordion";
import ServiceGrid from "./services/ServiceGrid";
import { useSearchParams } from "react-router-dom";

export default function Services() {

  const [params] = useSearchParams();
  const openFromUrl = params.get("open");


  // Мапимо категорії, прикріплюючи до кожної список її сервісів
  const accordionItems = serviceCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    services: services.filter((s) => s.category === cat.id),
    
  })).filter(it => it.services.length > 0); // показуємо лише не порожні

  const validIds = new Set(accordionItems.map(i => i.id));
  const defaultOpenId = validIds.has(openFromUrl) ? openFromUrl : null;


  return (
    <div className="container mx-auto px-4 py-16">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-brand-ink">Services</h1>
        <p className="mt-3 text-brand-ink/70 max-w-2xl mx-auto">
          Explore treatments, coloring, extensions, and more. Tap a category to view all options.
        </p>
      </header>

      <Accordion
        items={accordionItems}
        defaultOpenId={defaultOpenId}
        renderContent={(item) => (
          <ServiceGrid services={item.services} />
        )}
      />
    </div>
  );
}
