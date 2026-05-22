import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, TrendingUp, Lightbulb, Target, Wallet, Activity } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

// Mapping string names to React Components
const iconMap = {
  ShieldCheck,
  TrendingUp,
  Lightbulb,
  Target,
  Wallet,
  Activity,
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = ARTICLES.find((a) => a.slug === resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const Icon = iconMap[article.iconName];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navbar Minimalis */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl flex h-16 items-center px-4">
          <Link href="/#artikel" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="size-4" />
            Kembali
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 pt-12 sm:pt-20 animate-float-in">
        {/* Header Artikel */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {article.desc}
          </p>
        </div>

        {/* Ikon Dekoratif */}
        <div className="flex justify-center mb-12">
          <div className="size-24 rounded-3xl bg-muted/50 flex items-center justify-center shadow-inner border border-border/50 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Icon className="size-12 text-primary" />
          </div>
        </div>

        {/* Konten Artikel */}
        <article className="mx-auto bg-card p-8 sm:p-14 rounded-[2.5rem] border border-border/50 shadow-xl shadow-primary/5">
          {(() => {
            const lines = article.content.split('\n');
            const elements = [];
            let listItems: string[] = [];
            let isOrdered = false;

            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (!line) continue;

              const isBullet = line.startsWith('-');
              const isNumber = /^\d+\./.test(line);

              if (isBullet || isNumber) {
                isOrdered = isNumber;
                const content = line.replace(/^(-|\d+\.)\s/, '');
                listItems.push(content);
                
                // Cek baris berikutnya apakah masih list
                const nextLine = lines[i+1]?.trim() || '';
                const nextIsList = nextLine.startsWith('-') || /^\d+\./.test(nextLine);
                
                if (!nextIsList) {
                  const ListTag = isOrdered ? 'ol' : 'ul';
                  const listClass = isOrdered ? 'list-decimal marker:text-primary/70' : 'list-disc marker:text-primary';
                  elements.push(
                    <ListTag key={'list-'+i} className={`${listClass} pl-6 mb-8 space-y-3 text-lg text-muted-foreground`}>
                      {listItems.map((item, j) => {
                        const parts = item.split(/(\*\*.*?\*\*)/g);
                        return (
                          <li key={j} className="leading-loose pl-2">
                            {parts.map((part, k) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={k} className="text-foreground font-bold">{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                          </li>
                        )
                      })}
                    </ListTag>
                  );
                  listItems = [];
                }
              } else if (line.startsWith('### ')) {
                elements.push(
                  <h3 key={i} className="text-2xl sm:text-3xl font-extrabold mt-12 mb-6 text-foreground flex items-center gap-3">
                    <div className="w-8 h-1 bg-primary rounded-full"></div>
                    {line.replace('### ', '')}
                  </h3>
                );
              } else {
                const parts = line.split(/(\*\*.*?\*\*)/g);
                elements.push(
                  <p key={i} className="mb-8 text-lg text-muted-foreground leading-loose">
                    {parts.map((part, k) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={k} className="text-foreground font-bold">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </p>
                );
              }
            }
            return elements;
          })()}
        </article>

        {/* CTA Bottom */}
        <div className="mt-20 text-center bg-primary/5 border border-primary/10 rounded-3xl p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <h3 className="text-2xl font-bold mb-4">Siap untuk mempraktikkannya?</h3>
          <p className="text-muted-foreground mb-8">
            Catat keuangan Anda dengan Finsight dan mulailah perjalanan Anda menuju kebebasan finansial hari ini.
          </p>
          <Link href="/login?type=register" className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all items-center gap-2">
            Mulai Sekarang 
          </Link>
        </div>
      </main>
    </div>
  );
}
