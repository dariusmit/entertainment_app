import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
  horizontalSection: boolean;
}

function MoviesSectionSkeleton({ horizontalSection }: Props) {
  return (
    <div>
      <div
        className={horizontalSection ? `w-[44vw] h-[65.37vw]` : `w-full h-full`}
      >
        <Skeleton />
      </div>
    </div>
  );
}

export default MoviesSectionSkeleton;
