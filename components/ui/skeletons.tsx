import { Icons } from "@/components/icons";

export function PricingSectionSkeleton() {
  return (
    <section id="planos" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Escolha seu pacote
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-6 space-y-4 animate-pulse"
              >
                <div className="h-6 w-24 bg-muted rounded" />
                <div className="h-10 w-20 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-5/6 bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
                <div className="h-10 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CreditBalanceSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-card rounded-lg border border-border min-w-50 animate-pulse">
      <div className="flex items-center gap-2">
        <Icons.zap className="w-4 h-4 text-muted" />
        <div className="h-4 w-20 bg-muted rounded" />
      </div>
      <div className="h-4 w-12 bg-muted rounded" />
    </div>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Histórico de Transações
        </h2>
        <div className="h-4 w-32 bg-muted rounded mt-1" />
      </div>
      <div className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 bg-muted rounded" />
                <div>
                  <div className="h-4 w-40 bg-muted rounded mb-1" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-8 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlanCardsSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border p-6 space-y-4 animate-pulse"
        >
          <div>
            <div className="h-6 w-28 bg-muted rounded mb-2" />
            <div className="h-4 w-36 bg-muted rounded" />
          </div>
          <div>
            <div className="h-8 w-20 bg-muted rounded mb-1" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
            <div className="h-4 w-4/5 bg-muted rounded" />
          </div>
          <div className="h-10 w-full bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}
