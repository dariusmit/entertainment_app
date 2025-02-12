interface Props {
  horizontalSection: boolean | undefined;
}

function MoviesSectionSkeleton({ horizontalSection }: Props) {
  const cardsArray = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i}
        className={
          horizontalSection
            ? `w-[64vw] h-[37.33vw] relative overflow-hidden rounded-lg animated`
            : `h-[42.07vw] relative overflow-hidden animated`
        }
      >
        <p
          className={
            horizontalSection
              ? "w-full object-cover h-full rounded-lg"
              : "w-full h-[29.33vw] flex items-center justify-center rounded-lg mb-2"
          }
        ></p>
        <div
          className={horizontalSection ? "hidden" : "absolute bottom-0 left-0"}
        >
          <div className="flex mb-2">
            <p className="mr-2 w-[24px] h-[10px] rounded-md"></p>
            <p className="mr-2 w-[44px] h-[10px] rounded-md"></p>
            <p className=" mr-2 w-[7px] h-[10px] rounded-md"></p>
          </div>
          <p className="w-full h-[18px] rounded-md"></p>
        </div>
      </div>
    ));
  };

  return <>{cardsArray()}</>;
}

export default MoviesSectionSkeleton;
