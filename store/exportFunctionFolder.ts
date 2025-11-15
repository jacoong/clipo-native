export const returnDefaultProfielColor = (value: string | undefined | null) => {
  if (!value) {
    return '#1f2937';
  }

  const num = Number.parseInt(value.replace('default_', ''), 10);
  switch (num) {
    case 1:
      return '#2563eb';
    case 2:
      return '#4b5563';
    case 3:
      return '#111827';
    case 4:
      return '#7c3aed';
    default:
      return '#1f2937';
  }
};
