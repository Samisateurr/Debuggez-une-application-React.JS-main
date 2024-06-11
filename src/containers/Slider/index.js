import { useEffect, useState, useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data, error } = useData();
  const [index, setIndex] = useState(0);

  // Console.Log data et error
  useEffect(() => {
    /* eslint-disable no-console */
    console.log("Data:", data);
    console.log("Error:", error);
    /* eslint-enable no-console */
  }, [data, error]);

  // Assurez-vous que les données ne sont triées qu'une seule fois en utilisant useMemo pour éviter l'erreur "Rendered more hooks than during the previous render"
  const sortedData = useMemo(() => {
    if (data && data.focus) {
      return data.focus.sort((evtA, evtB) =>
        new Date(evtA.date) > new Date(evtB.date) ? 1 : -1
      );
    }
    return [];
  }, [data]);

  const nextCard = () => {
    setIndex((prevIndex) => (prevIndex + 1) % sortedData.length);
  };

  // Mettre en place l'interval de changement de Card
  useEffect(() => {
    const intervalId = setInterval(nextCard, 5000);
    return () => clearInterval(intervalId);
  }, [sortedData.length]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="SlideCardList">
      {sortedData.map((event, idx) => (
        <div
          key={event.id ? `slide-${event.id}` : `slide-${idx}`} // Ensure unique key
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {sortedData.map((event, radioIdx) => (
            <input
              key={event.id ? `radio-${event.id}` : `radio-${radioIdx}`} // Ensure unique key
              type="radio"
              name="radio-button"
              checked={index === radioIdx} 
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
