import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero-hair-one.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 text-center">
        <div className="max-w-3xl">
          <p className="text-sm tracking-widest uppercase text-white/80">
            Hair by Oleksandra
          </p>

          <h1 className="mt-4 text-4xl md:text-6xl font-semibold text-white">
            Elegant & Modern Hair Styling
          </h1>

          <p className="mt-5 text-white/85 text-lg leading-relaxed">
            Soft blonding, precision cuts, color and styling for effortless beauty.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
  href="https://book.squareup.com/appointments/219sgrmdrrv2xc/location/L5VKDHT7EYBSK/services"
  target="_blank"
  rel="noopener noreferrer"
  className="btn"
>
  Book Now
</a>

            <Link
              to="/services"
              className="rounded-full border border-white/70 px-7 py-3 text-white hover:bg-white hover:text-brand-ink transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
// import SectionTitle from "../components/SectionTitle";
// import ServiceCard from "../components/ServiceCard";
// import { popularServices } from "../data/services";
// import { Link } from "react-router-dom";
// import GalleryPreview from "../components/GalleryPreview";
// import { galleryHome } from "../data/gallery";
// import Testimonials from "../components/Testimonials";
// import { testimonials } from "../data/testimonials";
// const image = "/gallery/IMG_1122.jpg";


// export default function Home() {
//   return (

//     <div>
//     <section className="py-10 md:py-16">
//       <div className="container mx-auto px-4 grid items-center gap-10 md:grid-cols-2">
//         {/* Текстова частина */}
//         <div>
//           <div className="text-sm tracking-widest uppercase text-brand-ink/60">
//             Hair by Oleksandra
//           </div>
//           <h1 className="mt-2 text-4xl md:text-5xl font-semibold text-brand-ink">
//             Elegant & Modern Hair Styling
//           </h1>
//           <p className="mt-4 text-brand-ink/70 leading-relaxed">
//             I’m Oleksandra — a hair stylist focused on natural shapes, healthy
//             hair and effortless beauty. Precision cuts, multidimensional color,
//             soft blonding and styling for everyday confidence.
//           </p>

//           <div className="mt-6 flex flex-wrap gap-3">
//             <a href="/book" className="btn">BOOK NOW</a>
//             <a href="/services" className="btn bg-brand-surface text-brand-ink border border-brand-accent hover:bg-brand-accent/30">
//               View Services
//             </a>
//           </div>

//           {/* Короткі факти (опціонально) */}
//           <ul className="mt-6 flex flex-wrap gap-6 text-sm text-brand-ink/70">
//             <li>✂️ 7+ years experience</li>
//             <li>🎓 Certified colorist</li>
//             <li>📍 Halifax, NS</li>
//           </ul>
//         </div>

//         {/* Фото */}
//         <div className="relative">
//           <div className="absolute -inset-2 rounded-4xl bg-brand-accent/20 blur-xl" aria-hidden />
//           <img
//             // src={stylist}
//             alt="Oleksandra — hair stylist"
//             className="relative w-full aspect-[4/5] object-cover rounded-4xl bg-brand-surface border border-brand-accent shadow-soft"
//           />


          
       


//         </div>

        
//       </div>
//     </section>



//     <section className="relative py-16 bg-gradient-to-b from-brand-bg to-brand-surface/50">
//   <div className="container mx-auto px-4">
//     <SectionTitle
//       eyebrow="Services"
//       title="Popular services"
//       subtitle="Our most requested treatments for beautiful, healthy hair."
//     />

//     {/* Grid з картками */}
//     <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//       {popularServices.slice(0, 3).map(s => (
//         <div
//           key={s.id}
//           className="group rounded-2xl bg-brand-surface border border-brand-accent/40 p-6 shadow-soft
//                      hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
//         >
//           <h3 className="text-xl font-semibold text-brand-ink group-hover:text-brand-primary transition">
//             {s.title}
//           </h3>
//           <p className="mt-2 text-brand-ink/70">{s.desc}</p>
//           <div className="mt-4 text-sm font-medium text-brand-primary">{s.price}</div>

//           <div className="mt-6 flex gap-3">
//             <Link to="/book" className="btn">Book</Link>
//            <Link
//   to={`/services?open=${s.category}`}   // ← напр. open=treatments
//   className="inline-flex items-center rounded-xl border border-brand-accent px-4 py-2
//              text-brand-ink hover:bg-brand-accent/30 transition"
// >
//   Details
// </Link>

//           </div>
//         </div>
//       ))}
//     </div>

//     {/* Кнопка CTA */}
//     <div className="mt-12 text-center">
//       <Link
//         to="/services"
//         className="inline-flex items-center rounded-full px-8 py-3 font-medium shadow-soft
//                    bg-brand-primary text-white hover:bg-brand-ink transition"
//       >
//         See all services →
//       </Link>
//     </div>
//   </div>
// </section>

// <section>
//     <GalleryPreview items={galleryHome}/>

// </section>

// <section>
//     <Testimonials
//   items={testimonials}
//   googleProfileUrl="https://www.google.com/maps/place/Hair+by+Oleksandra+Penkova/@44.6948757,-63.5504542,17z/data=!3m1!4b1!4m6!3m5!1s0x4b5a27e0fc11093b:0x7573bfe590aa921d!8m2!3d44.6948719!4d-63.5478793!16s%2Fg%2F11xrkzs2bt?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D" // ← твій лінк на Google-профіль (опційно)
//  />
// </section>




    

//     </div>
//   );
// }
