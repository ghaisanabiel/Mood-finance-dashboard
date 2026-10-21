
import {
  Wallet,
  ShoppingBag,
  TrendingUp,
  Package,
  ArrowUpRight,
  Settings,
} from "lucide-react";

const metrics = [
  {
    title: "Pendapatan",
    value: "—",
    detail: "Menunggu data Shopee",
    icon: Wallet,
  },
  {
    title: "Profit Bersih",
    value: "—",
    detail: "Belum ada transaksi terverifikasi",
    icon: TrendingUp,
  },
  {
    title: "Biaya Iklan",
    value: "—",
    detail: "Menunggu laporan iklan",
    icon: ShoppingBag,
  },
  {
    title: "Nilai Inventori",
    value: "—",
    detail: "Menunggu data stok dan HPP",
    icon: Package,
  },
];

export default function Home() {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand">MØOD<span>.</span></div>
        <p className="muted">FINANCE SYSTEM</p>

        <nav>
          <a className="nav-active" href="/">Overview</a>
          <a href="#transactions">Transactions</a>
          <a href="#products">Products & Bundles</a>
          <a href="#advertising">Advertising</a>
          <a href="#inventory">Inventory</a>
          <a href="#reports">Financial Reports</a>
        </nav>

        <div className="sidebar-bottom">
          <Settings size={17} />
          <span>Settings</span>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="muted">BUSINESS INTELLIGENCE</p>
            <h1>Finance Overview</h1>
            <p className="subtitle">
              Pantau kesehatan keuangan bisnis MØOD.
            </p>
          </div>
          <span className="status">
            <span className="dot" />
            Data belum terhubung
          </span>
        </header>

        <section className="notice">
          <div>
            <strong>Hubungkan toko Shopee</strong>
            <p>
              Hubungkan toko untuk mulai mengimpor data
              pesanan dan membangun laporan keuangan.
            </p>
          </div>
          <a href="/settings">Konfigurasi <ArrowUpRight size={16} /></a>
        </section>

        <div className="section-heading">
          <h2>Ringkasan Keuangan</h2>
          <span>Data aktual belum tersedia</span>
        </div>

        <section className="metrics">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article className="metric" key={metric.title}>
                <div className="metric-top">
                  <span>{metric.title}</span>
                  <Icon size={19} />
                </div>
                <strong className="metric-value">
                  {metric.value}
                </strong>
                <p>{metric.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="bottom-grid">
          <article className="panel" id="transactions">
            <h2>Aktivitas Transaksi</h2>
            <div className="empty">
              <ShoppingBag size={28} />
              <strong>Belum ada transaksi</strong>
              <p>
                Data akan muncul setelah sumber data
                berhasil dihubungkan.
              </p>
            </div>
          </article>

          <article className="panel" id="products">
            <h2>Profitabilitas Produk</h2>
            <div className="empty">
              <TrendingUp size={28} />
              <strong>Menunggu data produk</strong>
              <p>
                HPP, penjualan, dan biaya diperlukan
                untuk menghitung profit.
              </p>
            </div>
          </article>
        </section>

        <footer>
          MØOD Finance · Dashboard internal ·
          Belum terhubung ke Shopee
        </footer>
      </section>
    </main>
  );
}
