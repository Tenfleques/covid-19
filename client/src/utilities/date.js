const en_dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const en_months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October", 
    "November",
    "December"
]

const getLocalDate = (datex) => {
    const date = new Date();
    return en_dates[date.getDay()] + ", " + en_months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

export default{
    getLocalDate : getLocalDate
}