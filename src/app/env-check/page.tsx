import { redirect } from "next/navigation";

export default function EnvCheckPage() {
  redirect("/api/check-env");
}
