import { redirect } from 'next/navigation';

export default function RedirectPage() {
  redirect('/login');
  return null;
}
