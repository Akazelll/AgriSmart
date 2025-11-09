import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className='space-y-6'>
      <h2 className='text-3xl font-bold tracking-light'>
        Welcome to AgriSmart Dashboard
      </h2>
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Total Panen</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-4xl font-bold'>1,250 kg</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
