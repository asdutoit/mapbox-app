import type { Property } from "../../types/Property";
import Currency from "@/src/utils/currency";

interface PropertyMarkerProps {
  property: Property;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function PropertyMarker(props: PropertyMarkerProps) {
  const priceText = () => {
    if (props.property.type === "rent") {
      return `${(props.property.price / 1000).toFixed(1)}`;
    }
    return `${(props.property.price / 1000).toFixed(0)}`;
  };
  const { price, currency } = Currency(
    props?.property?.currency || "USD",
    Number(priceText())
  );

  const backgroundColor = () => {
    if (props.isSelected) {
      return props.property.type === "rent" ? "#1D4ED8" : "#059669";
    }
    return props.property.type === "rent" ? "#3B82F6" : "#10B981";
  };

  return (
    <div
      onClick={props.onClick}
      class="property-marker flex items-center justify-center w-10 h-10 rounded-full border-3 border-white text-white font-bold text-sm cursor-pointer transition-all duration-200 hover:scale-110"
      style={{
        "background-color": backgroundColor(),
        "box-shadow": props.isSelected
          ? "0 4px 12px rgba(0,0,0,0.4)"
          : "0 2px 4px rgba(0,0,0,0.3)",
        "z-index": props.isSelected ? "1001" : "1",
        transform: props.isSelected ? "scale(1.2)" : "scale(1)",
      }}
    >
      {priceText()}
    </div>
  );
}
