namespace Server.ViewModels.Elixir
{
    public class ElixirDetailedResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ElixirCompositionResponseModel> Compositions { get; set; }
    }

    public class ElixirCompositionResponseModel
    {
        public string NoteCategory { get; set; }
        public decimal Proportion { get; set; }
        public NoteResponseModel Note { get; set; }
    }

    public class NoteResponseModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
