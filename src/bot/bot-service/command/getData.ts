export const botCommands = {
  prayer_counter: {
    geolocation: 0,
    name: 0,
  },
  add_address_counter: 0,
  maps_counter: 0,
  errors: 0,
};

const updateTime = () => {
  const moscowDate = new Date();
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  
  return (endOfDay.setHours(endOfDay.getHours() + 3) - (moscowDate.getTime() + 3 * (60 * 60000)));
};

setTimeout(() => {
  botCommands.maps_counter = 0;
  botCommands.prayer_counter.geolocation = 0;
  botCommands.prayer_counter.name = 0;
  botCommands.add_address_counter = 0;
  botCommands.errors = 0;
  updateTime(); 
}, updateTime());
 