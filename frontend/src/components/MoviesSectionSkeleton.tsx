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
            <p className="mr-2 w-[6.4vw] h-[2.67vw] rounded-md"></p>
            <p className="mr-2 w-[11.73vw] h-[2.67vw] rounded-md"></p>
            <p className=" mr-2 w-[1.87vw] h-[2.67vw] rounded-md"></p>
          </div>
          <p className="w-full h-[4.8vw] rounded-md"></p>
        </div>
      </div>
    ));
  };

  return <>{cardsArray()}</>;
}

export default MoviesSectionSkeleton;
