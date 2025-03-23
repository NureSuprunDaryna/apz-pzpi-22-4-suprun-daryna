using System;

namespace ProxyPatternExample
{
    // Спільний інтерфейс
    public interface IImage
    {
        void Display();
    }

    // Реальний об'єкт, який виконує основну роботу
    public class RealImage : IImage
    {
        private string _filename;

        public RealImage(string filename)
        {
            _filename = filename;
            LoadFromDisk();
        }

        private void LoadFromDisk()
        {
            Console.WriteLine($"Завантаження зображення: {_filename}");
        }

        public void Display()
        {
            Console.WriteLine($"Відображення зображення: {_filename}");
        }
    }

    // Проксі, який контролює доступ до RealImage
    public class ProxyImage : IImage
    {
        private RealImage _realImage;
        private string _filename;

        public ProxyImage(string filename)
        {
            _filename = filename;
        }

        public void Display()
        {
            if (_realImage == null)
            {
                _realImage = new RealImage(_filename);
            }
            _realImage.Display();
        }
    }

    class Program
    {
        static void Main()
        {
            IImage image = new ProxyImage("photo.jpg");

            // Зображення ще не завантажено
            Console.WriteLine("Перше звернення:");
            image.Display();

            // Повторне звернення — зображення вже в кеші
            Console.WriteLine("\nДруге звернення:");
            image.Display();
        }
    }
}
