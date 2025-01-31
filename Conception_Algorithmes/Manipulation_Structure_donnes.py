#Exercice 1 -----------------------------------------------------------

#2.2
#définition d'un noeud
class Node:
	def __init__(self,valeur):
		self.data=valeur
		self.next=None

#définition d'une liste chainée

class LinkedList:
	def __init__(self):
		self.head=None

#insertion au debut
	def insert_at_start(self,new_data):
		new_node= Node(new_data)
		new_node.next = self.head
		self.head = new_node

#affichage 
	def display(self):
		temp=self.head
		while temp:
			print(temp.data,end="->")
			temp=temp.next
		print("None")
#suppression

	def supprimer(self,element):
		if self.head is None:
			print("liste vide")
			return

		#premier element  : suppression direct
		if self.head.data == element:
			self.head = self.head.next
			print(f"{element} supprimé")
			return
		temp = self.head
		while temp.next:
			if temp.next.data == element:
				temp.next = temp.next.next
				print(f"{element} supprimé")
				return
			temp = temp.next
		print("pas de {element} dans la liste")
##Exercice 2 -----------------------------------------------------------

liste_chaine= LinkedList()
liste_chaine.insert_at_start(22)
liste_chaine.insert_at_start(22)
liste_chaine.insert_at_start(12)
liste_chaine.insert_at_start(45)

liste_chaine.display()
liste_chaine.supprimer(12)
liste_chaine.display()
liste_chaine.supprimer(22)
liste_chaine.display()

#3.2 
# définition d'une classe pile
class Pile:
	def __init__(self, taille=50):
		self.max = taille
		self.sommet = 0
		self.pile = []
#ajouter un élément à la fin d'une file
	def empiler(self, c):
		if self.estPleine():
			print("Pile pleine !")
		self.pile.append(c)
		self.sommet += 1
#retirer un élément au sommet de la file		
	def depiler(self):
		if self.estVide():
			print("Pile vide !")
		self.sommet -= 1
		return self.pile.pop()

	def afficher(self):
		print(f"[{''.join(self.pile)}]")

	def estVide(self):
		return self.sommet == 0
	
	def estPleine(self):
		return self.sommet == self.max
	

Pile=Pile()

Pile.empiler('2')
Pile.empiler('1')
Pile.afficher()
Pile.depiler()
Pile.afficher()

from collections import deque

File=deque()

# ajouter à la fin d'une file
File.append(1)
File.append(2)
File.append(3)
File.append(4)
print(File)
# retirer au debut d'une file
File.popleft()
print(File)

#Exercice 3 -----------------------------------------------------------

#4.2


#compter les occurences dans un dictionnaire

texte = "Hello Hello Hello monde monde monde monde monde"
compte = {}
for mot in texte.split():
	if mot in compte:
		compte[mot]+=1
	else:
		compte[mot]=1
print(compte)

#retirer les doublons en utilisant un ensemble
liste_1=['I','Wonder','How','Wonder','Why']

ens = set(liste_1)
print(ens)

#Compléxité des opérations

#Dictionnaire:O(1) car table de hachage dans le meilleur des cas et O(n) pire des cas (en cas de collision)
#Ensemble:O(1) car table de hachage dans le meilleur des cas  et O(n) pire des cas (en cas de collision)

#Exercice 4 -----------------------------------------------------------

#5.2 
#Si l'insertion ne se fait pas à la fin (ce qui se fait en O(1))
#Alors au pire des cas on devras parcourir tout le tableau donc O(n) dans le pire des cas où n est le nombre d'élements du tableau


#l'insertion d'une pile peut se faire que en haut et donc O(1)
#l'insertion dans une liste peut aller jusqu'a O(n) dans le pire des cas selon où on veut insérer(parcourir tous les valeurs)

#Supprimer dans une FIFO, premier entrée , premier sortie, il suffit de défiler(dans une file ) l'élément afin de le supprimer, il se fait en 0(1)


#Exercice 6: Projet Final

class File_attente:
	def __init__(self):
		self.file_classique=deque()
		self.pile_prioritaire=[]


	def defiler_file(self):

		if self.pile_vide() != 0:
			self.pile_prioritaire.pop()

		elif self.file_vide()!=0:
			self.file_classique.popleft()
		
		else :print("file vide")

	def pile_vide(self):
		return len(self.pile_prioritaire)

	def file_vide(self):
		return len(self.file_classique)

# on specifie si l'élément est prioritaire, True = oui , False = non et par défaut c'est faux
	def ajout_file(self,element,prio=False,):
		if prio:
			self.pile_prioritaire.append(element)
		else:
			self.file_classique.append(element)

	def afficher_tout(self):
		print("la file d'attente:",self.file_classique)
		print("\n")
		print("la file prioritaire:",self.pile_prioritaire)
file_element_attente = File_attente()

file_element_attente.ajout_file('element_1',True)
file_element_attente.ajout_file('element_2',False)
file_element_attente.ajout_file('element_3',True)
file_element_attente.ajout_file('element_4',False)
file_element_attente.afficher_tout()

file_element_attente.defiler_file()

file_element_attente.afficher_tout()

file_element_attente.defiler_file()
file_element_attente.afficher_tout()
file_element_attente.defiler_file()
file_element_attente.defiler_file()
file_element_attente.defiler_file()

file_element_attente.afficher_tout()


# Comment gérez-vous l’ajout d’éléments dans la pile prioritaire ?
# On ajoute dans la pile les éléments prioritaire selon l'ordre d'ajout dans la pile. si la personne est prioritaire on considere qu'elle est prioritaire par rapport aux autre personnes dans la pile prioritaire.
# remarque on peut créer une pile intermediaire de traitement afin de mieux gérer l'ajout des élements.

#Comment traitez-vous un élément de la pile prioritaire ou de la file d’attente?
#On regarde si il ya des éléments dans la pile prioritaire si oui on les dépile.
#On regarde ensuite si la file d'attente et on défile

#De manière classique une pile fonctionne en dernier arrivé, premier sorti et une file, premier arrivé premier sorti
# dans notre systeme on oblige la pile a dépiler avant de traiter la file
