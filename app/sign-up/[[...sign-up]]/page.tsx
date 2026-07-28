import SignUpClient from "./client";

export function generateStaticParams() {
  return [{ "sign-up": ["sign-up"] }];
}

export default function SignUpPage() {
  return <SignUpClient />;
}
