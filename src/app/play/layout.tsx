import "./customer.css";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="customer-site">{children}</div>;
}
