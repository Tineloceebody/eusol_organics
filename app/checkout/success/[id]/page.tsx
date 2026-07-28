import OrderSuccessClient from "./client";

export function generateStaticParams() {
  return [{ id: "order-success" }];
}

export default function OrderSuccessPage() {
  return <OrderSuccessClient />;
}
