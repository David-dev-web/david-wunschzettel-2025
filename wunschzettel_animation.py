from manim import *

class WeihnachtsWunschzettel(Scene):
    def construct(self):
        # 1. Titel (Startpunkt oben links)
        title = Text("Mein Weihnachtswunsch 2025").to_edge(UP).scale(1.2).set_color(YELLOW)
        self.play(Write(title))

        # 2. Wunsch 1: Smartphone (Positioniert UNTER dem Titel)
        wish1_text = Text("1. Samsung Galaxy S24").scale(0.8)
        wish1_context = Text("(Upgrade von A22 5G)").scale(0.5).next_to(wish1_text, RIGHT, buff=0.5)
        wish1 = VGroup(wish1_text, wish1_context).arrange(RIGHT, buff=0.5).next_to(title, DOWN, buff=0.7)
        
        self.play(FadeIn(wish1_text, shift=LEFT), FadeIn(wish1_context))
        self.wait(1)

        # 3. Wunsch 2: Musik-Software (Positioniert UNTER Wunsch 1)
        wish2 = Text("2. FL Studio Producer Edition").scale(0.8).next_to(wish1, DOWN, buff=0.5).align_to(wish1, LEFT)
        self.play(GrowFromEdge(wish2, LEFT))
        self.wait(1)

        # 4. Wunsch 3: DJ Equipment (Positioniert UNTER Wunsch 2)
        wish3 = Text("3. Pioneer DDJ-FLX4 DJ-Mischpult").scale(0.8).next_to(wish2, DOWN, buff=0.5).align_to(wish1, LEFT)
        self.play(Write(wish3))
        self.wait(1)

        # 5. Abschluss-Meldung (Bottom)
        closing = Text("Der ultimative Entwickler-Wunschzettel!").scale(0.7).to_edge(DOWN).set_color(GREEN)
        self.play(FadeIn(closing))

        self.wait(3)