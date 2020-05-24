const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const movieSelected = document.getElementById('movie');
const confirmButton = document.getElementById('confirm');

let count = document.querySelector('.count');
let total = document.querySelector('.total');
let ticketPrice = +movieSelected.value;

// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
}
// Get seats stored in local storage if any
function loadSeats() {
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
  const selectedSeatsConfirm = JSON.parse(localStorage.getItem('confirmedSelectedSeats'));
  const selectedMovieIndex = localStorage.getItem('selectedMovieIndex');

  if(selectedSeats) {
    selectedSeats.forEach((seat) => {
      seats[seat].classList.add('selected');
    });
  }
  if (selectedSeatsConfirm) {
    selectedSeatsConfirm.forEach((seat) => {
      seats[seat].classList.remove('selected');
      seats[seat].classList.add('occupied');
    });
  } 
  if(selectedMovieIndex) {
    movieSelected.selectedIndex = selectedMovieIndex;
    ticketPrice = +movieSelected.value;
  }
  updateSelectedCount();

}
loadSeats();
// Update the text count and total
function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const selectedSeatsCount = selectedSeats.length; 
  // Map selected to indices of all seats
  const seatsIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
  // Store the seatsIndex to local storage with JSON.stringify
  localStorage.setItem('selectedSeats', JSON.stringify(seatsIndex));
  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;

}
// When click on a seat
container.addEventListener('click', function(e) {
  let seat = e.target.classList;
  if(seat.contains('seat') && !seat.contains('occupied')) {
    seat.toggle('selected');
    updateSelectedCount();
  }
});
// When change a movie selection
movieSelected.addEventListener('change', function(e) {
  ticketPrice = +this.value;
  setMovieData(this.selectedIndex, this.value);
  updateSelectedCount();
});
// Confirm buying tickets
confirmButton.addEventListener('click', function(e) {
  const confirmYes = confirm("Are you sure?");
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats'));
  const selectedSeatsConfirm = JSON.parse(localStorage.getItem('confirmedSelectedSeats')) || [];
  if(confirmYes && selectedSeats) {
    selectedSeatsConfirm.push(...selectedSeats);
    localStorage.setItem('confirmedSelectedSeats', JSON.stringify(selectedSeatsConfirm));
    selectedSeats.forEach((seat) => {
      seats[seat].classList.remove('selected');
      seats[seat].classList.add('occupied');
    });
    movieSelected.selectedIndex = 0;
    updateSelectedCount();
  }
});