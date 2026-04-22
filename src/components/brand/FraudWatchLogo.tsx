type FraudWatchLogoProps = {
  className?: string;
  imageClassName?: string;
  widthClassName?: string;
};

const BRAND_IMAGE_SRC = "/AppIcon.png";

export function FraudWatchMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <span className={`inline-flex overflow-hidden rounded-2xl ${className}`.trim()}>
      <img
        src={BRAND_IMAGE_SRC}
        alt="FraudWatch icon"
        className="h-full w-full object-cover object-left"
      />
    </span>
  );
}

export default function FraudWatchLogo({
  className = "",
  imageClassName = "",
  widthClassName = "w-[220px]",
}: FraudWatchLogoProps) {
  return (
    <span className={`inline-flex items-center ${className}`.trim()}>
      <img
        src={BRAND_IMAGE_SRC}
        alt="FraudWatch AI Document & Digital Security"
        className={`${widthClassName} h-auto ${imageClassName}`.trim()}
      />
    </span>
  );
}
