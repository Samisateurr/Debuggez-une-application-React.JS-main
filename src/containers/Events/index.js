import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
// fix: filtrer les événements en fonction du type sélectionné
  const filteredEvents = data?.events.filter(event => !type || event.type === type) || [];
  // Paginer les événements filtrés.
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
// Calculer le nombre total de pages en fonction du nombre d'événements filtrés et du nombre d'événements par page.
// Math.ceil() est utilisé pour arrondir à la page supérieure
  const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);
// Extraire une liste unique de types d'événements à partir des données d'événement.
// data?.events.map() est utilisé pour mapper chaque événement vers son type.
// new Set() est utilisé pour créer un ensemble unique de types d'événements, éliminant ainsi les doublons.
// Array.from() est utilisé pour convertir l'ensemble en un tableau.
  const typeList = Array.from(new Set(data?.events.map((event) => event.type)));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(value) => changeType(value)}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {Array.from({ length: pageNumber }, (_, n) => (
              <a
                key={n}
                href="#events"
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
