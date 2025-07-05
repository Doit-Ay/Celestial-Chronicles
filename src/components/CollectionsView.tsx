import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, HelpCircle, Lightbulb, Rocket, Globe, Sparkles } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type GameState = {
    score: number;
    lives: number;
    highScore: number;
    isGameActive: boolean;
    isGameOver: boolean;
};

// --- AUDIO MANAGER (Stubbed) ---
class AudioManager {
    play(soundName: string) {
        // In a real app, you would play audio here.
        // console.log(`Playing sound: ${soundName}`);
    }
}
const audioManager = new AudioManager();

// --- ENHANCED SPACE QUIZ COMPONENT ---
const quizCategories = {
    "Planets & Moons": [
        { question: "Which planet is known as the Red Planet?", answers: ["Earth", "Mars", "Jupiter", "Venus"], correctAnswer: "Mars", explanation: "Mars is called the Red Planet because of the iron oxide (rust) on its surface, giving it a reddish appearance." },
        { question: "Which planet has the most confirmed moons?", answers: ["Saturn", "Jupiter", "Uranus", "Neptune"], correctAnswer: "Saturn", explanation: "As of recent discoveries, Saturn has overtaken Jupiter with the highest number of confirmed moons." },
        { question: "What is the largest volcano in our solar system, on Mars?", answers: ["Mauna Kea", "Mount Everest", "Olympus Mons", "Vesuvius"], correctAnswer: "Olympus Mons", explanation: "Olympus Mons is a massive shield volcano on Mars, about 2.5 times the height of Mount Everest." },
    ],
    "Space Exploration": [
        { question: "Who was the first human to walk on the Moon?", answers: ["Buzz Aldrin", "Yuri Gagarin", "Michael Collins", "Neil Armstrong"], correctAnswer: "Neil Armstrong", explanation: "Neil Armstrong was the commander of the Apollo 11 mission and the first person to step onto the lunar surface on July 20, 1969." },
        { question: "What was the name of the first artificial satellite launched into space?", answers: ["Explorer 1", "Sputnik 1", "Vostok 1", "Apollo 1"], correctAnswer: "Sputnik 1", explanation: "The Soviet Union successfully launched Sputnik 1 on October 4, 1957, sparking the Space Race." },
        { question: "Which NASA mission landed the first humans on the Moon?", answers: ["Apollo 11", "Gemini 7", "Mercury-Redstone 3", "Voyager 1"], correctAnswer: "Apollo 11" , explanation: "Apollo 11 was the spaceflight that first landed humans on the Moon. Commander Neil Armstrong and lunar module pilot Buzz Aldrin landed the Apollo Lunar Module Eagle on July 20, 1969."},
    ],
    "Stars & Galaxies": [
        { question: "What is the name of the galaxy we live in?", answers: ["Andromeda", "Triangulum", "Whirlpool", "Milky Way"], correctAnswer: "Milky Way", explanation: "Our solar system is located in the Orion Arm of the Milky Way, a barred spiral galaxy." },
        { question: "What is a supernova?", answers: ["A new star forming", "A powerful and luminous stellar explosion", "A cluster of stars", "A type of nebula"], correctAnswer: "A powerful and luminous stellar explosion", explanation: "A supernova occurs during the last evolutionary stages of a massive star's life, or when a white dwarf is triggered into runaway nuclear fusion." },
        { question: "What is the closest star to Earth?", answers: ["The Sun", "Proxima Centauri", "Alpha Centauri A", "Sirius"], correctAnswer: "The Sun", explanation: "The Sun is the star at the center of our Solar System. Proxima Centauri is the closest star to the Sun." },
        { question: "What is a black hole?", answers: ["A dead star", "A region of spacetime where gravity is so strong nothing can escape", "A planet with no light", "A dark nebula"], correctAnswer: "A region of spacetime where gravity is so strong nothing can escape", explanation: "A black hole's immense gravity is due to matter being squeezed into a tiny space. This can happen when a star is dying." },
    ]
};
type QuizCategory = keyof typeof quizCategories;

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
    <div className="w-full bg-slate-700 rounded-full h-2.5 mb-4">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(current / total) * 100}%` }}></div>
    </div>
);

const SpaceQuiz = () => {
    const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const questions = selectedCategory ? quizCategories[selectedCategory] : [];

    const handleCategorySelect = (category: QuizCategory) => {
        setSelectedCategory(category);
        handleRestart();
    };
    const handleAnswer = (answer: string) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        if (answer === questions[currentQuestionIndex].correctAnswer) {
            setIsCorrect(true);
            setScore(prev => prev + 1);
        } else {
            setIsCorrect(false);
        }
    };
    const handleNext = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setCurrentQuestionIndex(prev => prev + 1);
    };
    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };
    const backToCategories = () => {
        setSelectedCategory(null);
        handleRestart();
    };

    if (!selectedCategory) {
        return (
             <div className="bg-slate-800/50 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-white mb-6">Select a Category</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(Object.keys(quizCategories) as QuizCategory[]).map(category => (
                        <button key={category} onClick={() => handleCategorySelect(category)} className="p-6 bg-slate-700 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors duration-200 flex flex-col items-center justify-center space-y-2 group">
                            {category === "Planets & Moons" && <Globe className="w-8 h-8 group-hover:animate-spin"/>}
                            {category === "Space Exploration" && <Rocket className="w-8 h-8 group-hover:-translate-y-1 transition-transform"/>}
                            {category === "Stars & Galaxies" && <Sparkles className="w-8 h-8 group-hover:text-yellow-300 transition-colors"/>}
                            <span>{category}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }
    
    if (currentQuestionIndex >= questions.length) {
        return (
            <div className="text-center bg-slate-800/50 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
                <p className="text-slate-300 mt-2">You scored {score} out of {questions.length} in {selectedCategory}.</p>
                 <div className="flex justify-center space-x-4 mt-6">
                    <button onClick={handleRestart} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Play Again</button>
                    <button onClick={backToCategories} className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">Change Category</button>
                </div>
            </div>
        );
    }
    const { question, answers, correctAnswer, explanation } = questions[currentQuestionIndex];
    return (
        <div className="bg-slate-800/50 p-6 rounded-lg">
            <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
            <h3 className="text-xl font-bold text-white mb-4">{question}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {answers.map(answer => {
                    const isSelected = selectedAnswer === answer;
                    const isCorrectAnswer = answer === correctAnswer;
                    let buttonColor = 'bg-slate-700 hover:bg-slate-600';
                    if (isSelected) buttonColor = isCorrect ? 'bg-green-500' : 'bg-red-500';
                    else if (selectedAnswer && isCorrectAnswer) buttonColor = 'bg-green-500';
                    return (
                        <button key={answer} onClick={() => handleAnswer(answer)} disabled={!!selectedAnswer} className={`p-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-75 ${buttonColor}`}>
                            {answer}
                        </button>
                    );
                })}
            </div>
            <AnimatePresence>
            {selectedAnswer && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
                    <p className={`font-bold text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? 'Correct!' : `The correct answer is ${correctAnswer}.`}</p>
                    <p className="text-slate-300 mt-2 text-sm">{explanation}</p>
                    <button onClick={handleNext} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">Next Question</button>
                </motion.div>
            )}
            </AnimatePresence>
             <button onClick={backToCategories} className="text-slate-400 hover:text-white text-sm mt-6">&larr; Back to Categories</button>
        </div>
    );
};


// --- REFACTORED useAsteroidGame HOOK ---
const useAsteroidGame = () => {
    const [gameState, setGameState] = useState<GameState>({
        score: 0,
        lives: 3,
        highScore: 0,
        isGameActive: false,
        isGameOver: false,
    });
    
    const gameRefs = useRef({
        player: { x: 400, y: 450, width: 30, height: 20, speed: 7 },
        bullets: [] as any[],
        asteroids: [] as any[],
        explosions: [] as any[],
        stars: [] as any[],
        keys: {} as { [key: string]: boolean },
        isTouchDevice: false,
    });

    useEffect(() => {
        gameRefs.current.isTouchDevice = 'ontouchstart' in window;
        const storedHighScore = localStorage.getItem('asteroidHighScoreV4');
        if (storedHighScore) {
            setGameState(prev => ({ ...prev, highScore: parseInt(storedHighScore, 10) }));
        }
    }, []);

    const startGame = useCallback(() => {
        gameRefs.current.player = { x: 400, y: 450, width: 30, height: 20, speed: 7 };
        gameRefs.current.bullets = [];
        gameRefs.current.asteroids = [];
        gameRefs.current.explosions = [];
        setGameState(prev => ({ ...prev, score: 0, lives: 3, isGameOver: false, isGameActive: true }));
    }, []);
    
    const endGame = useCallback(() => {
        setGameState(prev => {
            const newHighScore = Math.max(prev.score, prev.highScore);
            if (newHighScore > prev.highScore) {
                localStorage.setItem('asteroidHighScoreV4', newHighScore.toString());
            }
            return { ...prev, isGameOver: true, isGameActive: false, highScore: newHighScore };
        });
    }, []);

    const incrementScore = useCallback(() => {
        setGameState(g => ({ ...g, score: g.score + 10 }));
    }, []);

    const loseLife = useCallback(() => {
        setGameState(g => {
            if (g.lives - 1 <= 0) {
                endGame();
                return { ...g, lives: 0 };
            }
            return { ...g, lives: g.lives - 1 };
        });
    }, [endGame]);

    return { gameState, gameRefs, startGame, endGame, incrementScore, loseLife };
};


// --- AsteroidSmasher View Component ---
const AsteroidGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { gameState, gameRefs, startGame, incrementScore, loseLife } = useAsteroidGame();
    const [mobileControls, setMobileControls] = useState({ left: false, right: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        // Initialize starfield if it's empty
        if (gameRefs.current.stars.length === 0) {
            for (let i = 0; i < 150; i++) {
                gameRefs.current.stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.2,
                    speed: Math.random() * 0.5 + 0.25 // Different speeds for parallax
                });
            }
        }

        let animationFrameId: number;
        
        const gameLoop = () => {
            // --- DRAWING BACKGROUND ---
            ctx.fillStyle = '#000010';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw stars for parallax effect
            ctx.fillStyle = 'white';
            gameRefs.current.stars.forEach(star => {
                star.y += star.speed;
                if (star.y > canvas.height) {
                    star.y = 0;
                    star.x = Math.random() * canvas.width;
                }
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            if (!gameState.isGameActive) {
                animationFrameId = requestAnimationFrame(gameLoop);
                return; // Keep drawing background when game is not active
            }

            // --- LOGIC UPDATES ---
            const { player, bullets, asteroids, keys, explosions } = gameRefs.current;
            
            const isMoving = keys['ArrowLeft'] || keys['ArrowRight'] || mobileControls.left || mobileControls.right;
            if ((keys['ArrowLeft'] || mobileControls.left) && player.x > player.width / 2) player.x -= player.speed;
            if ((keys['ArrowRight'] || mobileControls.right) && player.x < canvas.width - player.width / 2) player.x += player.speed;

            bullets.forEach((b, i) => { b.y -= 8; if (b.y < 0) bullets.splice(i, 1); });

            if (Math.random() < 0.025) { // Spawn logic
                const radius = Math.random() * 20 + 15;
                const x = Math.random() * (canvas.width - radius * 2) + radius;
                asteroids.push({ x, y: -radius, radius, speed: Math.random() * 2 + 1 });
            }
            asteroids.forEach((a, i) => { a.y += a.speed; if (a.y > canvas.height + a.radius) asteroids.splice(i, 1); });

            // Collision Detection
            asteroids.forEach((asteroid, aIndex) => {
                if (Math.hypot(player.x - asteroid.x, (player.y + player.height / 2) - asteroid.y) < asteroid.radius + player.height / 2) {
                    asteroids.splice(aIndex, 1);
                    loseLife();
                    audioManager.play('playerHit');
                    return;
                }
                bullets.forEach((bullet, bIndex) => {
                    if (Math.hypot(bullet.x - asteroid.x, bullet.y - asteroid.y) < asteroid.radius) {
                        for (let i = 0; i < asteroid.radius / 2; i++) {
                            explosions.push({
                                x: asteroid.x, y: asteroid.y,
                                radius: Math.random() * 2 + 1,
                                dx: (Math.random() - 0.5) * (Math.random() * 6),
                                dy: (Math.random() - 0.5) * (Math.random() * 6),
                                alpha: 1
                            });
                        }
                        asteroids.splice(aIndex, 1);
                        bullets.splice(bIndex, 1);
                        incrementScore();
                        audioManager.play('explosion');
                    }
                });
            });

            // --- DRAWING FOREGROUND ---
            // Player Thrust
            if (isMoving) {
                ctx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.5 + 0.5})`;
                ctx.beginPath();
                ctx.moveTo(player.x, player.y + player.height + 5);
                ctx.lineTo(player.x - 6, player.y + player.height + 15);
                ctx.lineTo(player.x + 6, player.y + player.height + 15);
                ctx.closePath();
                ctx.fill();
            }

            // Player Ship
            ctx.fillStyle = '#00BFFF';
            ctx.beginPath();
            ctx.moveTo(player.x, player.y);
            ctx.lineTo(player.x - player.width / 2, player.y + player.height);
            ctx.lineTo(player.x + player.width / 2, player.y + player.height);
            ctx.closePath();
            ctx.fill();

            // Bullets
            bullets.forEach(b => {
                 ctx.fillStyle = '#FFD700';
                 ctx.fillRect(b.x - 2, b.y, 4, 12);
            });

            // Asteroids
            asteroids.forEach(a => {
                ctx.fillStyle = '#A9A9A9';
                ctx.beginPath();
                ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Explosions
            explosions.forEach((p, pIndex) => {
                p.x += p.dx;
                p.y += p.dy;
                p.alpha -= 0.04;
                ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                if(p.alpha <= 0) explosions.splice(pIndex, 1);
            });
            
            animationFrameId = requestAnimationFrame(gameLoop);
        };
        
        gameLoop();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [gameState.isGameActive, incrementScore, loseLife, mobileControls, gameRefs]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            gameRefs.current.keys[e.key] = true;
            if (e.key === ' ' && gameState.isGameActive) {
                gameRefs.current.bullets.push({ x: gameRefs.current.player.x, y: gameRefs.current.player.y });
                audioManager.play('shoot');
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => { gameRefs.current.keys[e.key] = false; };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [gameState.isGameActive, gameRefs]);

    const handleMobileFire = () => {
        if (gameState.isGameActive) {
            gameRefs.current.bullets.push({ x: gameRefs.current.player.x, y: gameRefs.current.player.y });
            audioManager.play('shoot');
        }
    };

    return (
        <div className="bg-slate-900/80 p-2 sm:p-4 rounded-lg relative">
            <div className="relative w-full aspect-[16/10] select-none">
                <canvas ref={canvasRef} width="800" height="500" className="w-full h-full rounded-md bg-black" onClick={() => !gameState.isGameActive && startGame()}></canvas>
                
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-center items-center text-white text-center">
                    {!gameState.isGameActive && (
                        <div className="bg-black/50 p-8 rounded-lg pointer-events-auto">
                            <h2 className="text-4xl font-bold mb-4">{gameState.isGameOver ? 'GAME OVER' : 'ASTEROID SMASHER'}</h2>
                            {gameState.isGameOver && <p className="text-xl mb-2">Final Score: {gameState.score}</p>}
                            <p className="text-lg mb-6">High Score: {gameState.highScore}</p>
                            <button className="p-4 bg-blue-600 rounded-lg hover:bg-blue-700" onClick={startGame}>
                                {gameState.isGameOver ? 'PLAY AGAIN' : 'START GAME'}
                            </button>
                        </div>
                    )}
                </div>

                 <div className="absolute top-4 left-4 text-white font-mono text-lg z-10 pointer-events-none">SCORE: {gameState.score}</div>
                 <div className="absolute top-4 right-4 text-white font-mono text-lg flex items-center z-10 pointer-events-none">
                    LIVES: {Array(gameState.lives).fill(0).map((_, i) => <span key={i} className="text-red-500 text-2xl ml-2">♥</span>)}
                 </div>

                 {gameRefs.current.isTouchDevice && gameState.isGameActive && (
                    <>
                        <div className="absolute bottom-5 left-5 flex gap-4 z-10">
                            <button onTouchStart={() => setMobileControls(c => ({ ...c, left: true }))} onTouchEnd={() => setMobileControls(c => ({ ...c, left: false }))} className="w-16 h-16 bg-white/20 rounded-full text-white text-3xl active:bg-white/40">‹</button>
                            <button onTouchStart={() => setMobileControls(c => ({ ...c, right: true }))} onTouchEnd={() => setMobileControls(c => ({ ...c, right: false }))} className="w-16 h-16 bg-white/20 rounded-full text-white text-3xl active:bg-white/40">›</button>
                        </div>
                        <div className="absolute bottom-5 right-5 z-10">
                             <button onTouchStart={handleMobileFire} className="w-20 h-20 bg-red-500/50 rounded-full text-white text-xl active:bg-red-500/70">FIRE</button>
                        </div>
                    </>
                 )}
            </div>
             <div className="text-xs text-slate-400 mt-2 text-center">
                {gameRefs.current.isTouchDevice ? "Use on-screen controls to play" : "Use Arrow Keys to move, Spacebar to shoot"}
            </div>
        </div>
    );
};


// --- MAIN VIEW COMPONENTS ---
const CosmicFact = () => {
    return (
        <div className="bg-slate-800/50 border-dashed border-slate-700/50 rounded-xl p-6 mt-8">
            <div className="flex items-center space-x-3 mb-3">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                <h4 className="text-lg font-bold text-yellow-300">Cosmic Fact</h4>
            </div>
            <p className="text-slate-300 italic">"The center of our galaxy, the Milky Way, is thought to smell like rum and taste like raspberries, thanks to a chemical called ethyl formate."</p>
        </div>
    );
};

export const CollectionsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'quiz' | 'game' | 'facts'>('quiz');

    const renderContent = () => {
        switch (activeTab) {
            case 'game': return <AsteroidGame />;
            case 'facts': return <CosmicFact />;
            case 'quiz': default: return <SpaceQuiz />;
        }
    };

    return (
        <div className="min-h-screen relative z-10 font-sans bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Explore the Cosmos</h1>
                    <p className="text-slate-400 mt-3 text-lg">Test your knowledge, challenge your reflexes, or learn something new!</p>
                </div>
                <div className="flex justify-center space-x-2 border-b border-slate-700 mb-8">
                    <TabButton name="Space Quiz" icon={HelpCircle} isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
                    <TabButton name="Asteroid Smasher" icon={Gamepad2} isActive={activeTab === 'game'} onClick={() => setActiveTab('game')} />
                    <TabButton name="Cosmic Facts" icon={Lightbulb} isActive={activeTab === 'facts'} onClick={() => setActiveTab('facts')} />
                </div>
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const TabButton = ({ name, icon: Icon, isActive, onClick }: { name: string, icon: React.ElementType, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ease-in-out ${isActive ? 'border-blue-500 text-white' : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500'}`}>
        <Icon className="w-5 h-5" />
        <span>{name}</span>
    </button>
);
