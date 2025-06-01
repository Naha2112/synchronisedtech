import { notFound, redirect } from "next/navigation";
import { getClient, updateClient } from "@/app/autoflow/actions/clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import Link from "next/link";

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const clientId = Number(params.id);
  if (isNaN(clientId)) return notFound();

  const { success, client, message } = await getClient(clientId);
  if (!success || !client) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Client Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/autoflow/clients">
              <Button variant="outline">Back to Clients</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // This is a server component, so we can't use useForm directly. Render a form and handle POST.
  // For a real app, you might use a client component or server actions with form actions.

  return (
    <div className="container py-8 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Client</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            'use server';
            const data = {
              name: formData.get('name') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
            };
            const result = await updateClient(clientId, data);
            if (result.success) {
              redirect(`/autoflow/clients/${clientId}`);
            } else {
              // For simplicity, just reload the page with an error (could be improved)
              throw new Error(result.message || 'Failed to update client');
            }
          }} className="space-y-4">
            <div>
              <FormLabel>Name</FormLabel>
              <Input name="name" defaultValue={client.name} required minLength={2} />
            </div>
            <div>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" defaultValue={client.email} required />
            </div>
            <div>
              <FormLabel>Phone</FormLabel>
              <Input name="phone" defaultValue={client.phone || ""} />
            </div>
            <div className="flex gap-2 justify-end">
              <Link href={`/autoflow/clients/${clientId}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 