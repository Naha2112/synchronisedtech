// Server Component to handle params
import InvoiceEditForm from "./InvoiceEditForm"

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  return <InvoiceEditForm id={params.id} />
} 