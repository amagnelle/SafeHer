import { Home, Users, Settings, BarChart3 } from "lucide-react";

export function Sidebar() {
  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-purple-500/20 p-4">
      <h2 className="text-white text-xl font-bold mb-6">Painel Admin</h2>

      <nav className="space-y-2">
        <SidebarItem icon={<Home />} label="Dashboard" active />
        <SidebarItem icon={<BarChart3 />} label="Cliques" />
        <SidebarItem icon={<Users />} label="Usuários" />
        <SidebarItem icon={<Settings />} label="Configurações" />
      </nav>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
        active
          ? "bg-purple-600 text-white"
          : "text-gray-400 hover:bg-purple-500/20"
      }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}