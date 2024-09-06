import moment from "moment";
import Swal from "sweetalert2";

import { v4 as uuidv4 } from "uuid";

interface NotesType {
  title: string;
  id: string;
  text: string;
  date: number;
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-right",
  color: "#008000",
  iconColor: "green",
  icon: "info",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
});

//variables

let notes: NotesType[] = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data")!)
  : [];
//variables

// events handling

const editHandler = async (id: string) => {
  const note = notes.find((i) => i.id === id);

  const { value: formValues } = await Swal.fire({
    title: "EDIT NOTE",
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonColor: "#1182EC",
    confirmButtonText: "ADD NOTE",
    cancelButtonText: "CANCEL",
    preConfirm: () => {
      const titleElement = document.getElementById("title") as HTMLInputElement;
      const dispriptionElement = document.getElementById(
        "description"
      ) as HTMLInputElement;
      return [titleElement.value, dispriptionElement.value];
    },
    html: `
          <input value=${note?.title} class="input border" id="title">
          <textarea style="height:100px" id="description" class="input border mt-5">${note?.text}</textarea>
        `,
    focusConfirm: false,
  });
  if (formValues) {
    document.querySelector("#notes_id")!.innerHTML = "";
    note!.text = formValues[1];
    note!.title = formValues[0];
    localStorage.setItem("data", JSON.stringify(notes));
    notes.map((i) => {
      noteElement(i.text, i.title, i.id, i.date);
    });
    Toast.fire("is succeesfully");
  }
};

const removeHandler = (id: string) => {
  Swal.fire({
    title: "are you sure?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#1182ec",
    cancelButtonText: "CANCEL",
    cancelButtonColor: "red",
    confirmButtonText: "REMOVE",
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelector("#notes_id")!.innerHTML = "";
      notes = notes.filter((i) => i.id !== id);
      notes.map((i) => {
        noteElement(i.text, i.title, i.id, i.date);
      });
      localStorage.setItem("data", JSON.stringify(notes));
      Toast.fire("SuccessFully removed");
      if (notes.length <= 0) {
        const emptyElement = document.createElement("div");
        emptyElement.innerHTML = "There is no notes";
        emptyElement.className = "empty-state";
        emptyElement.id = "empty-state";
        document.querySelector("#notes_id")?.appendChild(emptyElement);
      }
    }
  });
};

const noteAlertHandler = async () => {
  const id = uuidv4();
  const date = moment().valueOf();
  const { value: formValues } = await Swal.fire({
    title: "ADD NOTE",
    showCancelButton: true,
    cancelButtonColor: "#d33",
    confirmButtonColor: "#1182EC",
    confirmButtonText: "ADD NOTE",
    cancelButtonText: "CANCEL",
    preConfirm: () => {
      const titleElement = document.getElementById("title") as HTMLInputElement;
      const dispriptionElement = document.getElementById(
        "description"
      ) as HTMLInputElement;
      return [titleElement.value, dispriptionElement.value];
    },
    html: `
          <input class="input border" id="title">
          <textarea style="height:100px" id="description" class="input border mt-5">
        `,
    focusConfirm: false,
  });
  if (formValues) {
    Swal.fire(JSON.stringify(formValues));
    notes.push({
      id: id,
      date: date,
      text: formValues[1],
      title: formValues[0],
    });
  }
  document.querySelector("#notes_id")!.innerHTML = "";
  notes.map((i) => {
    noteElement(i.text, i.title, i.id, i.date);
  });
  localStorage.setItem("data", JSON.stringify(notes));
  if (notes.length > 0) {
    document.querySelector("#empty-state")!.remove();
  }
};

//event handling

const noteButtons = (id: string) => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "note_buttons";
  const editButton = document.createElement("button");
  editButton.innerHTML = "edit";
  editButton.id = "edit-button";
  editButton.className = "edit_button";
  editButton.addEventListener("click", () => {
    editHandler(id);
  });

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "remove";
  removeButton.id = "remove-button";
  removeButton.className = "remove_button";
  removeButton.addEventListener("click", () => {
    removeHandler(id);
  });
  wrapperDiv.appendChild(removeButton);
  wrapperDiv.appendChild(editButton);
  return wrapperDiv;
};

const noteElement = (
  text: string,
  title: string,
  id: string,
  date?: number
) => {
  const element = document.createElement("div");
  element.className = "note";
  const h1Element = document.createElement("div");
  h1Element.style.fontSize = "24px";
  h1Element.innerHTML = title;
  const titleElement = document.createElement("div");
  titleElement.style.marginTop = "30px";
  titleElement.innerHTML = text;
  const dateElement = document.createElement("div");
  dateElement.style.marginTop="10px"
  dateElement.style.fontSize="14px"
  const wrapper = document.createElement("div");
  wrapper.className="note-container"
  wrapper.appendChild(h1Element);
  wrapper.appendChild(dateElement);
  dateElement.innerHTML = moment(date).fromNow();
  element.appendChild(wrapper);
  element.appendChild(titleElement);
  element.appendChild(noteButtons(id));
  document.querySelector("#notes_id")?.appendChild(element);
};

export const addNotes = (element: HTMLButtonElement) => {
  element.addEventListener("click", noteAlertHandler);
};

export const getNotes = () => {
  notes.map((i) => {
    noteElement(i.text, i.title, i.id, i.date);
  });
  if (notes.length > 0) {
    document.querySelector("#empty-state")!.remove();
  }
};
export const searchNotes = (element: HTMLInputElement) => {
  element.addEventListener("input", () => {
    document.querySelector("#notes_id")!.innerHTML = "";
    const filterdNotes = notes.filter((i) => {
      if (i.title.startsWith(element.value)) {
        return true;
      }
    });
    filterdNotes.map((i) => {
      noteElement(i.text, i.title, i.id, i.date);
    });
  });
};

export const sortNotes = (element: HTMLSelectElement) => {
  element.addEventListener("change", () => {
    document.querySelector("#notes_id")!.innerHTML = "";
    if (element.value === "none") {
      const sortedNone = notes.sort((a, b) => {
        return a.date - b.date;
      });
      sortedNone.map((i) => {
        noteElement(i.text, i.title, i.id, i.date);
      });
    }

    if (element.value === "alphabet") {
      const sortedByAlphabet = notes.sort(function (
        a: { title: string },
        b: { title: string }
      ) {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });
      sortedByAlphabet.map((i) => {
        noteElement(i.text, i.title, i.id, i.date);
      });
    }

    if (element.value === "date") {
      const sortedByDate = notes.sort((a, b) => {
        return b.date - a.date;
      });
      console.log(sortedByDate);
      sortedByDate.map((i) => {
        noteElement(i.text, i.title, i.id, i.date);
      });
    }
  });
};
