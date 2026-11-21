import Image from "next/image";
import { testimonials } from "@/content/testimonials";
const team = [
  {name:"Branislav Stojanovic",role:"Project Lead & Lead Integration Developer",image:"/team/branislav.webp",experience:"Active since 2013",bio:"Leads technical delivery, architecture, and complex integrations."},
  {name:"Predrag Stojanovic",role:"Front-end & WordPress Integration Developer",image:"/team/predrag.webp",experience:"Active since 2008",bio:"Builds and improves WordPress websites and responsive interfaces."},
  {name:"Sandra Lukic",role:"QA Engineer & Technical Support",image:"/team/sandra-lukic.webp",experience:"Active since 2011",bio:"Tests releases, validates workflows, and supports clients."},
  {name:"Marko Milojevic",role:"Senior Web Developer",image:"/team/marko-milojevic.webp",experience:"Web development since 2016",bio:"Builds front-end and back-end features and integrations."},
  {name:"Sanja Mazic",role:"Web QA & Project Support",image:"/team/sanja-mazic.webp",experience:"Quality-focused delivery",bio:"Supports content reviews, QA, and project coordination."},
] as const;


export function Team() {
  return <div className="simple-team-grid">{team.map(person=><article className="simple-team-card" key={person.name}><Image src={person.image} alt={person.name} width={500} height={520} sizes="(max-width:700px) 100vw, 380px" loading="lazy" /><div><h3>{person.name}</h3><p className="simple-team-role">{person.role}</p><p>{person.bio}</p></div></article>)}</div>;
}
export function Testimonials() {
  const selected=testimonials.filter(item=>["Forever Living Shop","Boots & Ladders","One Llama Travels"].includes(item.name));
  return <div className="simple-testimonials">{selected.map(item=><figure key={item.name}>
    <blockquote><p>“{item.quote.split(/(?<=[.!?])\s+/)[0]}”</p></blockquote>
    <figcaption><strong>{item.person}</strong><span>{item.name}</span></figcaption>
    {item.youtubeId&&<a className="text-link" href={`https://www.youtube.com/watch?v=${item.youtubeId}`} target="_blank" rel="noopener noreferrer">Watch testimonial</a>}
  </figure>)}</div>;
}
