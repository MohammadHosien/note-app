import { addNotes, getNotes, searchNotes, sortNotes } from "./notes";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <header>
      <div class="container">
      <div class="flex item-center">
        <h1>NOTE APP</h1>
        <div class="questionIcon">?</div>
      </div>
        <p class="header_p">List your notes here to remember them</p>
      </div>
    </header>
    <div class="search_header">
      <div class="container">
        <div class="search">
          <input id='search' class="input" placeholder="Search Note" />
          <select name="none" id="select">
            <option value="none">none</option>
            <option value="alphabet">alphabet</option>
            <option value="date">date</option>
          </select>
        </div>
      </div>
    </div>
    <div class="container">
      <button class="add_button" id="add_button">ADD NOTE</button>
    </div>
    <div id="notes_id" class="container notes">
      <div class="empty-state" id="empty-state">There is no notes</div>
    </div>
    <footer>Develope Mohammad Hossein Artaneh( 2024 )</footer>
`;

addNotes(document.querySelector("#add_button")!);
getNotes();
searchNotes(document.querySelector("#search")!);
sortNotes(document.querySelector("select")!);
