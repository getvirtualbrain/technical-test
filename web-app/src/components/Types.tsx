import { useEffect } from "react";
import { useGetTypes } from "../hooks/useGetTypes";

type Props = {
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TypeMultiSelect({
  selectedTypes,
  setSelectedTypes,
}: Props) {
  const { data: types, isLoading, isError } = useGetTypes();

  useEffect(() => {
    if (!types) return;

    setSelectedTypes(types.map((t) => t.name));
  }, [types, setSelectedTypes]);

  const toggleSelectedTypes = (typeName: string) => {
    setSelectedTypes((prev: string[]) =>
      prev.includes(typeName)
        ? prev.filter((t: string) => t !== typeName)
        : [...prev, typeName]
    );
  };

  if (isLoading) {
    return <div className="p-2 text-sm">Chargement des types...</div>;
  }
  if (isError) {
    return (
      <div className="p-2 text-red-500">
        Erreur lors du chargement des types
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mt-2`}
    >
      {types &&
        types.map((type) => {
          const isSelected = selectedTypes.includes(type.name);
          return (
            <button
              key={type.name}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleSelectedTypes(type.name)}
              className={`relative flex items-center gap-2 rounded-xl border p-1 text-left transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${
                isSelected
                  ? "bg-indigo-50 border-indigo-400 shadow-sm"
                  : "bg-white border-gray-200"
              }
            `}
            >
              <div className="flex-shrink-0">
                <img
                  src={type.image}
                  alt={type.name}
                  className="h-4 w-4 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{type.name}</div>
              </div>
              <div className="ml-1">
                {isSelected ? (
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-indigo-500 text-white">
                    ✓
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border border-gray-300" />
                )}
              </div>
            </button>
          );
        })}
    </div>
  );
}
