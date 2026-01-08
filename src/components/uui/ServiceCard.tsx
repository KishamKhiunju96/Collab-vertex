type Props = {
  title: string;
  description: string;
};

export default function ServiceCard({ title, description }: Props) {
  return (
    <div className="rounded-xl  border border-gray-800 p-6 mb-7">
      <h3 className="text-xl font-semibold text-text-primary mb-3">{title}</h3>
      <p className="text-text-primary">{description}</p>
    </div>
  );
}
