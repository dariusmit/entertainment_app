interface Props {
  horizontalSection: boolean | undefined;
}

function MoviesSectionSkeleton({ horizontalSection }: Props) {
  const arrayLength = horizontalSection ? 3 : 8;

  const cardsArray = () => {
    return Array.from({ length: arrayLength }, (_, i) => (
      <div
        key={i}
        className={
          horizontalSection
            ? `w-[64vw] h-[32.33vw] tablet:h-[31vw] desktop:w-[535.666px] desktop:h-[15.97vw] relative overflow-hidden rounded-lg animated`
            : `h-[42.07vw] tablet:h-[26vw] desktop:h-[16.2vw] relative overflow-hidden animated`
        }
      >
        <p
          className={
            horizontalSection
              ? "w-full object-cover h-full rounded-lg"
              : "w-full h-[29.33vw] tablet:h-[18vw] desktop:h-[12vw] flex items-center justify-center rounded-lg mb-2"
          }
        ></p>
        <div
          className={horizontalSection ? "hidden" : "absolute bottom-0 left-0"}
        >
          <div className="flex mb-2">
            <p className="mr-2 w-[6.4vw] h-[2.67vw] tablet:h-[2vw] desktop:h-[1vw] desktop:w-[3vw] rounded-md"></p>
            <p className="mr-2 w-[11.73vw] h-[2.67vw] tablet:h-[2vw] desktop:h-[1vw] desktop:w-[6vw] rounded-md"></p>
            <p className=" mr-2 w-[1.87vw] h-[2.67vw] tablet:h-[2vw] desktop:h-[1vw] desktop:w-[2vw] rounded-md"></p>
          </div>
          <p className="w-full h-[4.8vw] tablet:h-[3vw] desktop:h-[2vw] desktop:w-[13vw] rounded-md"></p>
        </div>
      </div>
    ));
  };

  return <>{cardsArray()}</>;
}

export default MoviesSectionSkeleton;
