interface StatsCardProps {
  label: string;
  value: number;
}

//Layout för lässtatistik på profil
const StatsCard = ({ label, value }: StatsCardProps) => {
  return (
    <div className="stats-card">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
};

export default StatsCard;