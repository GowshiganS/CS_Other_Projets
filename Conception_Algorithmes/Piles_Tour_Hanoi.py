
import copy

class PileChar:
	def __init__(self, taille=50):
		self.max = taille
		self.sommet = 0
		self.pile = []
#Exercice 4
	def __eq__(self, other):
		if self.compter() == other.compter():
			return self.pile == other.pile
		else : return False
			
#Exercice 2
	def empiler(self, c):
		if self.estPleine():
			print("Pile pleine !")
		self.pile.append(c)
		self.sommet += 1
		
	def depiler(self):
		if self.estVide():
			print("Pile vide !")
		self.sommet -= 1
		return self.pile.pop()
		
	def estVide(self):
		return self.sommet == 0
	
	def estPleine(self):
		return self.sommet == self.max
	
	def taille(self):
		return self.max
	
	def compter(self):
		return self.sommet

	def affichergen(self):
		print(self.pile)

	def afficher(self):
		print(f"[{''.join(self.pile)}]")

	def graphiquepile(self):
		print("---------")
		for i in range(self.sommet-1,-1,-1):
			print(self.pile[i])
		print("---------")		

# Exemple d’utilisation
pile = PileChar(5)
pile.empiler('a')
pile.empiler('b')
pile.empiler('c')
pile.afficher()  # Affichera : [abc]
print(pile.depiler()) #Affichera : c
pile.afficher() #Affichera: [ab]
pile.empiler('c')


pile1=PileChar(5)
pile2=PileChar(3)

pile1.empiler('z')
pile2.empiler('z')
print(pile1 == pile2)


#Exercice 4
pile2 = copy.deepcopy(pile1)
print(pile2.taille())
pile2.afficher()

#Exercice 6

pile3=PileChar(6)
pile3.empiler("Petite")
pile3.empiler("Maison")
pile3.empiler("Bleue")

print(pile3.depiler())
print(pile3.depiler())
print(pile3.depiler())

#Exercice 7
pile4=PileChar(6)
pile4.empiler("Petite")
pile4.empiler(pile)
pile4.empiler(999.0)

print(pile4.depiler())
print(pile4.depiler())
print(pile4.depiler())

#Exercice 8

def est_palindrome(mot):
	pile = PileChar(len(mot))
	pile_inverse = PileChar(len(mot))
	for char in mot:
		pile.empiler(char)
	temp = copy.deepcopy(pile)
	while temp.estVide() != True:
		pile_inverse.empiler(temp.depiler())
	return pile == pile_inverse

mot="radar"

print(est_palindrome(mot))

#Exercice 9
# regle du jeu :
# on peut pas déplacer plus d'un disque à la fois
# on ne peut placer un disque que sur un autre disque plus grand que lui ou sur un emplacement vide


class Hanoi:
	def __init__(self,nbr_disque):
		self.Tour1= PileChar(nbr_disque)
		self.Tour2= PileChar(nbr_disque)
		self.Tour3= PileChar(nbr_disque)
		self.TourVictoire=PileChar(nbr_disque)
		self.max = nbr_disque
		#Ajout des disques sur la tour 1 avant de commencer le jeu
		for i in range(1,self.max+1):
			self.Tour1.empiler(Disque(i))
			self.TourVictoire.empiler(Disque(i))

	def deplacer(self,emplacement1,emplacement2):
		if emplacement1.estVide():
			print("Il y a rien a déplacer")

		elif emplacement2.estVide():
			temp = emplacement1.depiler()
			emplacement2.empiler(temp)
		elif emplacement2.pile[-1].numero > emplacement1.pile[-1].numero:
			temp = emplacement1.depiler()
			emplacement2.empiler(temp)

		else: print("Déplacement interdit !")

	def checkvictoire(self):
		if self.Tour3.pile == self.TourVictoire.pile:
			print("Vous avez gagné !")
		else : print("Condition de victoire non atteinte")

class Disque:
	def __init__(self,numero):
		self.numero=numero

	#lisibilité
	def __str__(self):
		return f"Disque {self.numero}"
	def __repr__(self):
		return self.__str__()

Jeu=Hanoi(5)


Jeu.Tour1.affichergen()
#Jeu.Tour3.pile = Jeu.TourVictoire.pile
Jeu.checkvictoire()

#Exercice 10

pile.graphiquepile()