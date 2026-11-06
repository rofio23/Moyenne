let matieres = [];

try {
    const sauvegarde = JSON.parse(
        localStorage.getItem("matieres")
    );

    if (Array.isArray(sauvegarde)) {
        matieres = sauvegarde.filter(m =>
            typeof m.nom === "string" &&
            typeof m.note === "number" &&
            Number.isFinite(m.note) &&
            m.note >= 0 &&
            m.note <= 20 &&
            typeof m.coef === "number" &&
            Number.isFinite(m.coef) &&
            m.coef > 0
        );
    }
} catch (erreur) {
    matieres = [];
}

const formulaire = document.getElementById("formulaire");
const entreeMatiere = document.getElementById("matiere");
const entreeNote = document.getElementById("note");
const entreeCoef = document.getElementById("coefficient");
const liste = document.getElementById("liste-matieres");
const resultat = document.getElementById("moyenne");

function sauvegarder() {
    try {
        localStorage.setItem(
            "matieres",
            JSON.stringify(matieres)
        );
    } catch (erreur) {
        console.warn("Sauvegarde impossible", erreur);
    }
}

function calculer() {
    if (matieres.length === 0) {
        resultat.textContent = "-- / 20";
        return;
    }

    let total = 0;
    let totalCoef = 0;

    matieres.forEach(matiere => {
        total += matiere.note * matiere.coef;
        totalCoef += matiere.coef;
    });

    const moyenne = total / totalCoef;

    resultat.textContent =
        moyenne.toFixed(2).replace(".", ",") + " / 20";
}

function afficher() {
    liste.innerHTML = "";

    matieres.forEach((matiere, index) => {
        const element = document.createElement("li");
        element.className = "matiere-item";

        const information = document.createElement("span");
        information.className = "matiere-info";

        information.textContent =
            matiere.nom + " | " +
            matiere.note + "/20 | Coef : " +
            matiere.coef;

        const bouton = document.createElement("button");
        bouton.className = "btn-supprimer";
        bouton.textContent = "Supprimer";
        bouton.type = "button";

        bouton.addEventListener("click", () => {
            supprimer(index);
        });

        element.appendChild(information);
        element.appendChild(bouton);

        liste.appendChild(element);
    });

    calculer();
}

function ajouter(event) {
    event.preventDefault();

    const nom = entreeMatiere.value.trim();

    const note = Number(
        entreeNote.value.replace(",", ".")
    );

    const coef = Number(
        entreeCoef.value.replace(",", ".")
    );

    if (nom === "") {
        alert("Entre le nom de la matière.");
        return;
    }

    if (
        entreeNote.value.trim() === "" ||
        !Number.isFinite(note) ||
        note < 0 ||
        note > 20
    ) {
        alert("La note doit être entre 0 et 20.");
        return;
    }

    if (
        entreeCoef.value.trim() === "" ||
        !Number.isFinite(coef) ||
        coef <= 0
    ) {
        alert("Le coefficient doit être supérieur à 0.");
        return;
    }

    matieres.push({
        nom: nom,
        note: note,
        coef: coef
    });

    sauvegarder();
    afficher();

    formulaire.reset();
    entreeMatiere.focus();
}

function supprimer(index) {
    matieres.splice(index, 1);

    sauvegarder();
    afficher();
}

formulaire.addEventListener("submit", ajouter);

afficher();

