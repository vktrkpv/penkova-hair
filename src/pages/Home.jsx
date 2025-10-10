import stylist from "../assets/IMG_1122.jpg"; 
import SectionTitle from "../components/SectionTitle";
import ServiceCard from "../components/ServiceCard";
import { popularServices } from "../data/services";
import { Link } from "react-router-dom";
import GalleryPreview from "../components/GalleryPreview";
import { galleryHome } from "../data/gallery";
import Testimonials from "../components/Testimonials";
import { testimonials } from "../data/testimonials";


export default function Home() {
  return (

    <div>
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4 grid items-center gap-10 md:grid-cols-2">
        {/* Текстова частина */}
        <div>
          <div className="text-sm tracking-widest uppercase text-brand-ink/60">
            Hair by Oleksandra
          </div>
          <h1 className="mt-2 text-4xl md:text-5xl font-semibold text-brand-ink">
            Elegant & Modern Hair Styling
          </h1>
          <p className="mt-4 text-brand-ink/70 leading-relaxed">
            I’m Oleksandra — a hair stylist focused on natural shapes, healthy
            hair and effortless beauty. Precision cuts, multidimensional color,
            soft blonding and styling for everyday confidence.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/book" className="btn">BOOK NOW</a>
            <a href="/services" className="btn bg-brand-surface text-brand-ink border border-brand-accent hover:bg-brand-accent/30">
              View Services
            </a>
          </div>

          {/* Короткі факти (опціонально) */}
          <ul className="mt-6 flex flex-wrap gap-6 text-sm text-brand-ink/70">
            <li>✂️ 7+ years experience</li>
            <li>🎓 Certified colorist</li>
            <li>📍 Halifax, NS</li>
          </ul>
        </div>

        {/* Фото */}
        <div className="relative">
          <div className="absolute -inset-2 rounded-4xl bg-brand-accent/20 blur-xl" aria-hidden />
          <img
            src={stylist}
            alt="Oleksandra — hair stylist"
            className="relative w-full aspect-[4/5] object-cover rounded-4xl bg-brand-surface border border-brand-accent shadow-soft"
          />


          
       


        </div>

        
      </div>
    </section>



    <section className="relative py-16 bg-gradient-to-b from-brand-bg to-brand-surface/50">
  <div className="container mx-auto px-4">
    <SectionTitle
      eyebrow="Services"
      title="Popular services"
      subtitle="Our most requested treatments for beautiful, healthy hair."
    />

    {/* Grid з картками */}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {popularServices.slice(0, 3).map(s => (
        <div
          key={s.id}
          className="group rounded-2xl bg-brand-surface border border-brand-accent/40 p-6 shadow-soft
                     hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <h3 className="text-xl font-semibold text-brand-ink group-hover:text-brand-primary transition">
            {s.title}
          </h3>
          <p className="mt-2 text-brand-ink/70">{s.desc}</p>
          <div className="mt-4 text-sm font-medium text-brand-primary">{s.price}</div>

          <div className="mt-6 flex gap-3">
            <Link to="/book" className="btn">Book</Link>
           <Link
  to={`/services?open=${s.category}`}   // ← напр. open=treatments
  className="inline-flex items-center rounded-xl border border-brand-accent px-4 py-2
             text-brand-ink hover:bg-brand-accent/30 transition"
>
  Details
</Link>

          </div>
        </div>
      ))}
    </div>

    {/* Кнопка CTA */}
    <div className="mt-12 text-center">
      <Link
        to="/services"
        className="inline-flex items-center rounded-full px-8 py-3 font-medium shadow-soft
                   bg-brand-primary text-white hover:bg-brand-ink transition"
      >
        See all services →
      </Link>
    </div>
  </div>
</section>

<section>
    <GalleryPreview items={galleryHome}/>

</section>

<section>
    <Testimonials
  items={testimonials}
  googleProfileUrl="https://g.page/r/XXXXXXXX" // ← твій лінк на Google-профіль (опційно)
 />
</section>




    

    </div>
  );
}
