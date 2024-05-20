import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const response = await fetch("/events.json");
    return response.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const getData = useCallback(async () => {
    try {
      const fetchedData = await api.loadData();
      const processedData = fetchedData.focus.map((event, index) => ({
        ...event,
        id: event.id || `${event.title}-${event.date}-${index}`,
      }));
      setData({ ...fetchedData, focus: processedData });
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (!data) getData();
  }, [data, getData]);

  const contextValue = useMemo(() => ({ data, error }), [data, error]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;