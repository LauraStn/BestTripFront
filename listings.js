const listings = document.querySelector('.listings')
const listingBtn = document.querySelector("#listingBtn");
const listingMsg = document.querySelector(".listing-msg");
const jwt = localStorage.getItem('token')
const userListings = document.querySelector(".userListings");

async function getAllListings() {
  let getAll = await fetch('http://localhost:3500/listing/all')
  let result = await getAll.json()
  console.log(result);

  result.forEach((listing) =>{
    listings.innerHTML += `<div class="bg-white rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden">
    <img class="h-56 lg:h-60 w-full object-cover" src="${listing.image}" alt="" />
    <div class="p-3">
        <span class="text-sm text-primary">${listing.eventDate}</span>
        <h3 class="font-semibold text-xl leading-6 text-gray-700 my-2">${listing.title}
        </h3>
        <p class="paragraph-normal text-gray-600">${listing.description}
        </p>
        <p class="mt-3 block text-right text-black"> Number of participants:
              ${listing.participant}/${listing.maxParticipant}
            </p>
            <button class="m-2 hover:bg-gray-400 text-black border px-4 rounded-md" onclick="">Participate<button/> 
    </div>
</div>`
  })
}
if (listings) {
  getAllListings();
}


async function getAllFromUser() {

  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };
  let getAll = await fetch(`http://localhost:3500/listing/mine`, request);
  let result = await getAll.json();
  console.log(jwt);
  result.forEach((listing) => {
    userListings.innerHTML += `<div
            class="rounded-lg border shadow-md max-w-xs md:max-w-none overflow-hidden"
          >
            <img
              class="h-56 lg:h-60 w-full object-cover"
              src="${listing.image}"
              alt=""
            />
            <div class="p-3">
              <span class="text-sm text-black">${listing.eventDate}</span>
              <h3 class="font-semibold text-xl leading-6 text-black my-2">
               ${listing.title}
              </h3>
              <p class="text-black">
                ${listing.description}
              </p>
              <p class="mt-3 font-semibold block text-right text-black">
                ${listing.place}
              </p>
              <p class="mt-3 block text-right text-black"> Number of participants:
              ${listing.participant}/${listing.maxParticipant}
            </p>
            </div>
            <button class="m-2 hover:bg-gray-400 text-black font-bold border px-4 rounded-md" onclick="deleteListing('${listing._id}')">Delete<button/> 
            <button class="m-2 hover:bg-gray-400 text-black font-bold border px-4 rounded-md" onclick="displayEdit('${listing._id}')">Edit<button/>`;
  });
}
if (userListings) {
  getAllFromUser();
}

async function createListing() {
  let title = document.querySelector("#title").value;
  let description = document.querySelector("#description").value;
  let image = document.querySelector("#image").value;
  let maxParticipant = document.querySelector("#maxParticipant").value;
  let eventDate = document.querySelector("#eventDate").value;
  let place = document.querySelector('#place').value

  let newListing = {
    user_id: jwt,
    title: title,
    description: description,
    image: image,
    maxParticipant: maxParticipant,
    eventDate: eventDate,
    place: place
  };
  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(newListing),
  };
  let apiRequest = await fetch("http://localhost:3500/listing/add", request);
  let result = await apiRequest.json();
  console.log(jwt);
  if (apiRequest.status !== 201) {
    console.log(result);
    listingMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-red-600 font-bold">Missing fields !</p>`;
    return;
  }

  listingMsg.innerHTML = `<p class="mt-7 text-center rounded-lg text-lime-500 font-bold">Listing added !</p>`;
}
if (listingBtn) {
  listingBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createListing();
    userListings.innerHTML = "";
    getAllFromUser();
  });
}
async function deleteListing(listingId) {
  let request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },


  };
  console.log(listingId);
  let apiRequest = await fetch(
    `http://localhost:3500/listing/delete/${listingId}`,
    request
  );
  let result = await apiRequest.json();
  window.alert("Listing deleted !");
  userListings.innerHTML = "";
  getAllFromUser();
}

async function displayEdit(listingId) {
  const editModal = document.querySelector(".edit");

  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,

    },
  };
  let apiRequest = await fetch(
    `http://localhost:3500/listing/one/${listingId}`,
    request
  );
  let result = await apiRequest.json();
  console.log(result);
  editModal.innerHTML = `
  <div
    id="editListing"
    class="lg:p-36 mx-auto md:p-52 sm:20 p-8 w-3/5 rounded-lg"
  >
    <h2 class="text-2xl font-semibold mb-4 text-center">Edit your listing</h2>
    <form method="post" id="form">
    <div class="mb-4">
        <label for="image" class="block text-grey-100">
          Title
        </label>
        <input
          type="text"
          id="editTitle"
          name="title"
          class="title w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value="${result.title}"
        />
      </div>
      <div class="mb-4">
        <label for="image" class="block text-grey-100">
          Image URL
        </label>
        <input
          type="url"
          id="editImage"
          name="image"
          class="image w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value="${result.image}"
        />
      </div>
      <div class="mb-7">
        <label for="place" class="block text-grey-100">
          Place
        </label>
        <input
          type="text"
          id="editPlace"
          name="editPlace"
          class="place w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          value="${result.place}"
        />
      </div>
      <div class="mb-7">
      <label for="place" class="block text-grey-100">
        Event Date
      </label>
      <input
        type="date"
        id="editEventDate"
        name="editEventDate"
        class="eventDate w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
        value="${result.eventDate}"
      />
    </div>
    <div class="mb-7">
    <label for="place" class="block text-grey-100">
      Max Participant 
    </label>
    <input
      type="number"
      id="editMaxParticipant"
      name="editMaxParticipant"
      class="maxParticipant w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
      value="${result.maxParticipant}"
    />
  </div>
      <div class="mb-7">
        <label for="description" class="block text-grey-100">
          Description
        </label>
        <textarea
          id="editDescription"
          name="editDescription"
          class="description w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
          autocomplete="off"
        >${result.description}</textarea>
      </div>
      <button
      onclick="updateListing('${result._id}')"
        id="editBtn"
        type="button"
        class="bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md py-2 px-4 w-full"
      >
        Edit
      </button>
      <p class="edit-msg"></p>
    </form>
  </div>`;
}
async function updateListing(listingId) {
  let image = document.querySelector("#editImage").value;
  let place = document.querySelector("#editPlace").value;
  let description = document.querySelector("#editDescription").value;
  let title = document.querySelector("#editTitle").value;
  let eventDate = document.querySelector("#editEventDate").value;
  let maxParticipant = document.querySelector("#editMaxParticipant").value;



  const editMsg = document.querySelector(".edit-msg");

  let editListing = {
    image: image,
    place: place,
    description: description,
    title: title,
    eventDate: eventDate,
    maxParticipant: maxParticipant,

  };

  let request = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(editListing),
  };
  let apiRequest = await fetch(
    `http://localhost:3500/listing/edit/${listingId}`,
    request
  );
  let result = await apiRequest.json();
  if(apiRequest.status !==200){
    console.log("missing fields");
    editMsg.innerText = 'Missing fields !';
    return
  }
  editMsg.innerText = 'Product updated !';
  setTimeout(() => {
    // window.location.reload();
  }, "2000");
  return
}
