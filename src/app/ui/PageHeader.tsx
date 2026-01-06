type Props = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: Props) {
  return (
    <div className="mb-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight  text-text-primary sm:text-5xl ">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg text-text-primary">{description}</p>
      )}
    </div>
  );
}
