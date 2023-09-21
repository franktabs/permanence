import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import IGroupe from '../../interfaces/igroupe';
import { MatDialog } from '@angular/material/dialog';
import {
  CRITERE_OBJECT,
  DataModalInput,
  ModalInputComponent,
} from '../modal-input/modal-input.component';
import { Subject, takeUntil } from 'rxjs';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-card-group-personnel',
  templateUrl: './card-group-personnel.component.html',
  styleUrls: ['./card-group-personnel.component.scss'],
})
export class CardGroupPersonnelComponent implements OnInit, OnDestroy {
  @Input()
  public groupe: IGroupe = {
    nom: 'group',
    criteres: [],
    personnels: new Set(),
  };

  public destroy$: Subject<boolean> = new Subject();

  public criteres_object: typeof CRITERE_OBJECT = CRITERE_OBJECT;

  @Output() public completePersonnelEmit: EventEmitter<boolean> =
    new EventEmitter();

  constructor(private diallog: MatDialog, private api: ApiService) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {}

  ajout(type: 'PERSONNEL' | 'CRITERE') {
    let diallogRef = this.diallog.open<ModalInputComponent, DataModalInput>(
      ModalInputComponent,
      {
        data: {
          title: type == 'PERSONNEL' ? 'Ajout Personnel' : 'Choix Critères',
          model: undefined,
          type: type,
          critere_object: this.criteres_object,
        },
      }
    );
    diallogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((subs) => {
        console.log('fermeture du modal card group valeur retournée', subs);
        if (type == 'PERSONNEL') {
          if (typeof subs == 'boolean' && subs == true) {
            this.completePersonnelEmit.emit(true);
          } else if (!(!subs || typeof subs == 'string')) {
            let personnel: IApiPersonnel = subs;
            this.groupe.personnels.add(personnel);
          }
        } else if (type == 'CRITERE' && subs) {
          console.log('voici le subs de retour', subs);
          let criteres_object_modal: typeof CRITERE_OBJECT = subs;
          this.criteres_object = criteres_object_modal;
          let criteresExist = this.groupe.criteres.map((obj) => obj.nom);
          this.groupe.criteres = [];
          Object.keys(criteres_object_modal).forEach((value) => {
            let keyCritere: keyof typeof CRITERE_OBJECT = value as any;
            if (this.criteres_object[keyCritere] == true) {
              this.groupe.criteres.unshift({ nom: keyCritere });
            }
          });
        }
      });
  }

  deletePerson(index: number, personnel: IApiPersonnel) {
    this.groupe.personnels.delete(personnel);
  }

  deleteCritere(index: number) {
    this.criteres_object[this.groupe.criteres[index].nom] = false;
    this.groupe.criteres.splice(index, 1);
  }
}
