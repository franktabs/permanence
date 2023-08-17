import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public loader_modal$: Subject<boolean> = new Subject();

  constructor() {
    this.loader_modal$.next(false);
  }

  seeElement(querySelector: string, className: string) {
    const elementToObserve = document.querySelector(querySelector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // L'élément est maintenant visible au défilement
          if (!elementToObserve?.classList.contains(className))
            elementToObserve?.classList.add(className);
          console.log("L'élément est visible");
          // Ajoutez ici votre logique supplémentaire
        } else {
          elementToObserve?.classList.remove(className);

          // L'élément n'est plus visible au défilement
          console.log("L'élément n'est plus visible");
        }
      });
    });
    // Commencez à observer l'élément cible
    if (elementToObserve) observer.observe(elementToObserve);
  }

  seeMiddleElement(querySelector: string, className: string) {
    // Sélectionnez l'élément que vous souhaitez observer
    const elementToObserve = document.querySelector(querySelector);

    // Créez une instance de l'Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        const targetRect = target.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calcul de la position verticale du milieu de l'élément
        const elementMidpoint = targetRect.top + targetRect.height / 2;

        if (elementMidpoint >= 0 && elementMidpoint <= viewportHeight) {
          // L'élément est au milieu de la partie visible
          if (!elementToObserve?.classList.contains(className))
            elementToObserve?.classList.add(className);
          // Ajoutez ici votre logique supplémentaire
        } else {
          // L'élément n'est pas au milieu de la partie visible
          elementToObserve?.classList.remove(className);
          console.log("L'élément n'est pas au milieu de la partie visible");
        }
      });
    });

    // Commencez à observer l'élément cible
    if (elementToObserve) observer.observe(elementToObserve);
  }
}
