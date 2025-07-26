'use client';

const PlaceholderContent = ({ title }) => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2">Konten untuk {title.toLowerCase()} akan ditampilkan di sini.</p>
      </div>
    </div>
);

export default function DashboardPage() {
    return <PlaceholderContent title="Sedang di kembangkan" />;
}
