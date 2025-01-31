from abc import ABC, abstractmethod
import pygame

LARGEUR = 1280
HAUTEUR = 720

class GameObjet(ABC):

	@abstractmethod
	def afficher(self, surface):
		pass

	@abstractmethod
	def mettre_à_jour(self):
		pass

class Raquette(GameObjet):
	def __init__(self):
		self.Longeur_plateforme = 120
		self.Hauteur_plateforme = 20
		self.vitesse = 400  
		self.rectangle = pygame.Rect(
			LARGEUR // 2 - self.Longeur_plateforme // 2,
			HAUTEUR - self.Hauteur_plateforme - 10,
			self.Longeur_plateforme,
			self.Hauteur_plateforme
		)

	def afficher(self, surface):
		pygame.draw.rect(surface, "white", self.rectangle)

	def mettre_à_jour(self, keys, dt):
		if keys[pygame.K_LEFT]:
			self.rectangle.x -= self.vitesse * dt
		if keys[pygame.K_RIGHT]:
			self.rectangle.x += self.vitesse * dt
		# Collisions avec les bords de l'écran
		if self.rectangle.left < 0:
			self.rectangle.left = 0
		if self.rectangle.right > LARGEUR:
			self.rectangle.right = LARGEUR

class Balle(GameObjet):
	def __init__(self):
		self.pos_x = LARGEUR // 2
		self.pos_y = HAUTEUR // 2
		self.taille_balle = 15
		self.vitesse_x = 300
		self.vitesse_y = -300

	def afficher(self, surface):
		pygame.draw.circle(surface, "white", (int(self.pos_x), int(self.pos_y)), self.taille_balle)

	def mettre_à_jour(self, dt):
		self.pos_x += self.vitesse_x * dt
		self.pos_y += self.vitesse_y * dt

		# Collision avec les murs gauche et droit
		if self.pos_x - self.taille_balle <= 0 or self.pos_x + self.taille_balle >= LARGEUR:
			self.vitesse_x = -self.vitesse_x

		# Collision avec le mur du haut
		if self.pos_y - self.taille_balle <= 0:
			self.vitesse_y = -self.vitesse_y

class Brique(GameObjet):
	def __init__(self, x, y, largeur, hauteur, couleur):
		self.rectangle = pygame.Rect(x, y, largeur, hauteur)
		self.couleur = couleur
		self.intacte = True

	def afficher(self, surface):
		if self.intacte:
			pygame.draw.rect(surface, self.couleur, self.rectangle)

	def mettre_à_jour(self):
		pass

class Jeu:
	def __init__(self):
		self.raquette = Raquette()
		self.balle = Balle()
		self.briques = []
		self.vie = 3
		self.running = True
		self.score = 0
		self.creer_briques()

	def creer_briques(self):
		# Création du tableau de briques
		rows = 5
		cols = 10
		largeur_brique = LARGEUR // cols
		hauteur_brique = 30
		for row in range(rows):
			for col in range(cols):
				x = col * largeur_brique
				y = row * hauteur_brique + 50
				couleur = (255, 255, 255)  # Briques blanches
				brique = Brique(x, y, largeur_brique - 5, hauteur_brique - 5, couleur)
				self.briques.append(brique)

	def gestion_evenement(self):
		for event in pygame.event.get():
			if event.type == pygame.QUIT:
				self.running = False

	def maj_affichage(self, screen):
		screen.fill("black")
		self.raquette.afficher(screen)
		self.balle.afficher(screen)
		for brique in self.briques:
			brique.afficher(screen)
		font = pygame.font.Font(None, 36)
		text_vie = font.render(f"Vies: {self.vie}", True, "red")
		screen.blit(text_vie, (10, 50))
		text_score = font.render(f"Score: {self.score}", True, "red")
		screen.blit(text_score, (10, 75))


	def detect_collision(self):
		# Conversion de la position de la balle en rectangle pour la détection des collisions
		balle_rect = pygame.Rect(
			self.balle.pos_x - self.balle.taille_balle,
			self.balle.pos_y - self.balle.taille_balle,
			self.balle.taille_balle * 2,
			self.balle.taille_balle * 2
		)

		# Collision avec la raquette
		if balle_rect.colliderect(self.raquette.rectangle):
			self.balle.vitesse_y = -abs(self.balle.vitesse_y)  # La balle rebondit vers le haut
			# Ajustement de la position de la balle
			self.balle.pos_y = self.raquette.rectangle.top - self.balle.taille_balle

		# Collision avec les briques
		for brique in self.briques:
			if brique.intacte and balle_rect.colliderect(brique.rectangle):
				self.balle.vitesse_y = -self.balle.vitesse_y
				brique.intacte = False
				self.score += 10
				break  # On ne gère qu'une collision par frame

	def logique_jeu(self):
		# Vérification de la fin du jeu
		if all(not brique.intacte for brique in self.briques):
			print("Gagné!")
			print("Score = "+ str(self.score))
			self.running = False

		# La balle touche le bas de l'écran
		if self.balle.pos_y - self.balle.taille_balle > HAUTEUR:
			self.vie -=1		
			if self.vie == 0 :
				print("Game Over!")
				print("Score = "+ str(self.score))
				self.running = False
			else:
				self.balle=Balle()
				self.raquette=Raquette()

	def run(self):
		pygame.init()
		screen = pygame.display.set_mode((LARGEUR, HAUTEUR))
		pygame.display.set_caption("Casse-briques")
		clock = pygame.time.Clock()

		dt = 0

		while self.running:
			self.gestion_evenement()
			keys = pygame.key.get_pressed()
			self.raquette.mettre_à_jour(keys, dt)
			self.balle.mettre_à_jour(dt)
			self.detect_collision()
			self.logique_jeu()
			self.maj_affichage(screen)
			pygame.display.flip()
			dt = clock.tick(60) / 1000  # Limite à 60 FPS

		pygame.quit()

# Lancement du jeu
if __name__ == "__main__":
	jeu = Jeu()
	jeu.run()
