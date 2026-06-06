import { ServicePage } from "@/components/service-page"; import { metadata as meta } from "@/lib/site";
export const metadata=meta("Custom web development services","Custom web development, WordPress development, CMS development, API integrations, payment workflows, and custom website features.","/web-development");
export default function Page(){return <ServicePage type="development"/>}
