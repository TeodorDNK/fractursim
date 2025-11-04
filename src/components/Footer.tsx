type Props = { t: Record<string, any> };
export default function Footer({ t }: Props) {
  return (
    <footer className="site border-t text-gray-500">
      <div className="max-w-[1100px] mx-auto px-5 py-6">
        <small>{t.footer?.rights || 'Fracturism®'}</small>
      </div>
    </footer>
  );
}
