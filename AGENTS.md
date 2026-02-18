Agents Guide

Ce document définit les règles obligatoires que tout agent de code doit respecter lors du développement de la librairie.

Ce projet vise une qualité library-grade.

Stabilité > Rapidité
Clarté > Astuces
Prédictibilité > Magie

# 1. Respect strict du plan
L’agent doit suivre strictement docs/plan.md.

Aucune étape ne peut être sautée.

Une seule étape doit être implémentée à la fois.

Une étape ne peut être marquée DONE que si :

Tous les tests passent.

docs/progress.md a été mis à jour correctement.

L’agent ne doit jamais anticiper les étapes suivantes.


# 2. Architecture obligatoire

La librairie doit être :

Totalement headless

Framework-agnostic

SSR-safe

Interdictions strictes :

Aucun accès à window

Aucun accès à document

Aucun accès aux APIs DOM

Aucune dépendance à un framework UI

Aucune dépendance à une librairie date externe sauf décision explicitement validée dans docs/plan.md

Le core doit idéalement être dependency-free.

# 3. Modèle de données

Les types publics sont strictement :

CalendarDate → YYYY-MM-DD

LocalTime → HH:mm

LocalDateTime → YYYY-MM-DDTHH:mm

Contraintes :

Le core ne doit jamais exposer Date natif dans l’API publique.

Le core ne doit jamais dépendre d’un timezone système.

Toute validation doit être explicite.

Aucun comportement implicite basé sur l’environnement.

# 4. Tests (obligatoires)

Framework de test : Vitest

Chaque fonction publique doit être testée.

Les edge cases doivent être couverts :

années bissextiles

bornes mois/jour

bornes heures/minutes

min/max

contraintes combinées

Les tests doivent être déterministes.

Toute dépendance à “today” doit être injectable.

Une étape n’est jamais validée si les tests échouent.

# 5. Qualité du code

TypeScript strict mode obligatoire.

Aucun any non justifié.

Fonctions pures privilégiées.

Pas de logique dupliquée inutilement.

Les prop-getters ne doivent jamais dépendre de types DOM.

L’API doit correspondre exactement à celle définie dans docs/plan.md.

# 6. Controlled vs Uncontrolled

Le comportement doit être cohérent et documenté.

En mode controlled :

L’état interne ne doit pas être la source de vérité.

Les callbacks doivent être appelés correctement.

Aucune mutation interne silencieuse.

En mode uncontrolled :

L’état interne est la source de vérité.

Les setters doivent modifier correctement le state.

# 7. Documentation obligatoire

À la fin de chaque étape :

L’agent doit mettre à jour docs/progress.md en :

mettant à jour le tableau Status

ajoutant une entrée dans Journal

listant :

fichiers créés

fichiers modifiés

tests ajoutés

décisions prises

Aucune étape ne peut être considérée comme terminée sans cette mise à jour.

# 8. Packaging

ESM first

Types générés

sideEffects correctement configuré

Aucun export mort

Build propre (aucune erreur TypeScript)

# 9. Interdictions

L’agent ne doit jamais :

Ajouter une dépendance sans justification documentée.

Réécrire une étape déjà validée sans raison.

Modifier docs/plan.md sans documenter la raison dans docs/progress.md.

Implémenter des fonctionnalités hors scope de l’étape en cours.

Introduire de la logique liée au DOM.

# 10. Définition de “DONE”

Une étape est terminée uniquement si :

Les tests passent.

L’API correspond au plan.

docs/progress.md est à jour.

Aucun warning TypeScript.

Aucun comportement implicite non documenté.

# 11. Commentaires de fonctions (JSDoc)

Toutes les fonctions doivent être commentées avec un format de type JSDoc.

Exigences :

Les commentaires doivent être concis mais précis.

Chaque commentaire doit expliquer clairement ce que fait la fonction, son comportement attendu et, si utile, ses contraintes.

Les fonctions internes doivent aussi être documentées.

Les fonctions exposées publiquement doivent être documentées en priorité, avec un niveau de clarté supérieur pour aider les utilisateurs de la librairie (hints d’usage, entrées/sorties, cas importants).

# Workflow obligatoire

À chaque exécution :

Lire docs/plan.md

Identifier l’étape en cours

Implémenter uniquement cette étape

Ajouter ou mettre à jour les tests

Vérifier que les tests passent

Mettre à jour docs/progress.md

S’arrêter
